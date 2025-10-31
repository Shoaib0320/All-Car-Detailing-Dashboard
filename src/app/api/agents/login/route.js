import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Agent from '@/Models/Agent';
import connectDB from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectDB();
    
    const { agentId, password } = await request.json();

    // Find agent by agentId
    const agent = await Agent.findOne({ agentId }).populate('shift');

    if (!agent) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, agent.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        agentId: agent.agentId,
        id: agent._id,
        email: agent.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}