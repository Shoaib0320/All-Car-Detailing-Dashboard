// //app/api/agents/login/route.js
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import connectDB from '@/lib/mongodb';
// import Agent from '../../../../Models/Agent';

// export async function POST(request) {
//   try {
//     await connectDB();
    
//     const { agentId, password } = await request.json();

//     // Find agent by agentId
//     const agent = await Agent.findOne({ agentId }).populate('shift');

//     if (!agent) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, agent.password);

//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { 
//         agentId: agent.agentId,
//         id: agent._id,
//         email: agent.email
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     return NextResponse.json({
//       message: 'Login successful',
//       token,
//       agent: {
//         id: agent._id,
//         agentName: agent.agentName,
//         agentId: agent.agentId,
//         email: agent.email,
//         shift: agent.shift
//       }
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }








// app/api/agents/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Agent from '../../../../Models/Agent';

export async function POST(request) {
  console.log('🔐 Login API Called');
  
  try {
    // Connect to database
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Database connected');

    // Parse request body
    console.log('📥 Parsing request body...');
    const { agentId, password } = await request.json();
    
    console.log('📋 Login attempt details:', { 
      agentId, 
      passwordLength: password ? password.length : 0 
    });

    // Validate input
    if (!agentId || !password) {
      console.log('❌ Missing credentials:', { agentId: !!agentId, password: !!password });
      return NextResponse.json(
        { error: 'Agent ID and password are required' },
        { status: 400 }
      );
    }

    // Find agent by agentId
    console.log('🔍 Searching for agent:', agentId);
    const agent = await Agent.findOne({ agentId }).populate('shift');
    
    console.log('📊 Agent search result:', agent ? 'Agent found' : 'Agent not found');

    if (!agent) {
      console.log('❌ Agent not found in database');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if agent is active
    if (agent.isActive === false) {
      console.log('❌ Agent account is inactive');
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Check password
    console.log('🔑 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, agent.password);
    
    console.log('🔐 Password validation result:', isPasswordValid ? 'Valid' : 'Invalid');

    if (!isPasswordValid) {
      console.log('❌ Invalid password provided');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.log('❌ JWT_SECRET is missing in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate JWT token
    console.log('🎫 Generating JWT token...');
    const token = jwt.sign(
      { 
        agentId: agent.agentId,
        id: agent._id,
        email: agent.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for agent:', agent.agentId);
    console.log('📦 Response data:', {
      agentId: agent.agentId,
      agentName: agent.agentName,
      hasShift: !!agent.shift
    });

    return NextResponse.json({
      message: 'Login successful',
      token,
      agent: {
        id: agent._id,
        agentName: agent.agentName,
        agentId: agent.agentId,
        email: agent.email,
        shift: agent.shift
      }
    });

  } catch (error) {
    console.error('💥 Login API Error:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    // Specific error handling
    if (error.name === 'MongoNetworkError') {
      console.log('❌ Database connection failed');
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 503 }
      );
    }

    if (error.name === 'JsonWebTokenError') {
      console.log('❌ JWT generation failed');
      return NextResponse.json(
        { error: 'Token generation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}