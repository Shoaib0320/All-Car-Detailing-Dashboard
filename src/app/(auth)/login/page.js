// // "use client";

// // import { useState, useEffect } from 'react';
// // import { useRouter } from 'next/navigation';
// // import Link from 'next/link';
// // import { useAuth } from '@/context/AuthContext';
// // // import GCLogo from '@/images/GCLogo.png';

// // export default function LoginPage() {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);

// //   const { login, isAuthenticated, loading } = useAuth();
// //   const router = useRouter();

// //   // Redirect if already authenticated
// //   useEffect(() => {
// //     if (!loading && isAuthenticated) {
// //       router.push('/dashboard');
// //     }
// //   }, [isAuthenticated, loading, router]);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     setIsLoading(true);

// //     try {
// //       const result = await login(email, password);

// //       if (result.success) {
// //         router.push('/dashboard');
// //       } else {
// //         setError(result.message);
// //       }
// //     } catch (error) {
// //       setError('An unexpected error occurred');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Checking authentication...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (isAuthenticated) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
// //           <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full space-y-8">
// //         <div>
// //           <div className="mx-auto h-12 w-auto flex justify-center">
// //             {/* Your logo here */}
// //             <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
// //               <span></span>
// //             </div>
// //           </div>
// //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //             Sign in to your account
// //           </h2>
// //           <p className="mt-2 text-center text-sm text-gray-600">
// //             Or{' '}
// //             <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
// //               go back to home
// //             </Link>
// //           </p>
// //         </div>

// //         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
// //           {error && (
// //             <div className="rounded-md bg-red-50 p-4">
// //               <div className="flex">
// //                 <div className="flex-shrink-0">
// //                   <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
// //                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
// //                   </svg>
// //                 </div>
// //                 <div className="ml-3">
// //                   <h3 className="text-sm font-medium text-red-800">{error}</h3>
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           <div className="rounded-md shadow-sm -space-y-px">
// //             <div>
// //               <label htmlFor="email" className="sr-only">
// //                 Email address
// //               </label>
// //               <input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 autoComplete="email"
// //                 required
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// //                 placeholder="Email address"
// //               />
// //             </div>
// //             <div>
// //               <label htmlFor="password" className="sr-only">
// //                 Password
// //               </label>
// //               <input
// //                 id="password"
// //                 name="password"
// //                 type="password"
// //                 autoComplete="current-password"
// //                 required
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
// //                 placeholder="Password"
// //               />
// //             </div>
// //           </div>

// //           <div className="flex items-center justify-between">
// //             <div className="flex items-center">
// //               <input
// //                 id="remember-me"
// //                 name="remember-me"
// //                 type="checkbox"
// //                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
// //               />
// //               <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
// //                 Remember me
// //               </label>
// //             </div>

// //             <div className="text-sm">
// //               <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
// //                 Forgot your password?
// //               </a>
// //             </div>
// //           </div>

// //           <div>
// //             <button
// //               type="submit"
// //               disabled={isLoading}
// //               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
// //             >
// //               {isLoading ? (
// //                 <div className="flex items-center">
// //                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
// //                   Signing in...
// //                 </div>
// //               ) : (
// //                 'Sign in'
// //               )}
// //             </button>
// //           </div>

// //           <div className="text-center">
// //             <p className="text-sm text-gray-600">
// //               Demo Credentials: <br />
// //               Email: superadmin@example.com <br />
// //               Password: admin123456
// //             </p>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // src/app/(auth)/login/page.jsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import {GCLogo} from '@/images/GCLogo.png';

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { login, isAuthenticated, loading, checkAuthStatus } = useAuth();
//   const router = useRouter();

//   // ✅ Redirect if user is already authenticated
//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       router.replace("/dashboard"); // replace instead of push to prevent going back
//     }
//   }, [isAuthenticated, loading, router]);

//   // ✅ Also check token in localStorage if context not yet loaded
//   useEffect(() => {
//     if (!isAuthenticated && typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       if (token) {
//         checkAuthStatus(); // verify token from server
//       }
//     }
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       const result = await login(email, password);
//       if (result.success) {
//         router.replace("/dashboard"); // ✅ redirect immediately after login
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       setError("An unexpected error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Loading UI while checking
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // If already logged in, show redirect spinner
//   if (isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // 🔽 Rest of your login form remains same...
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <div className="mx-auto h-12 w-auto flex justify-center">
//             {/* Your logo here */}
//           </div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
//               back to home
//             </Link>
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />

//             </div>

//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Signing in...
//                 </div>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </div>

//           {/* <div className="text-center">
//             <p className="text-sm text-gray-600">
//               Demo Credentials: <br />
//               Email: superadmin@example.com <br />
//               Password: admin123456
//             </p>
//           </div> */}
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
// import GCLogo from "@/../public/images/GCLogo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) router.push("/dashboard");
      else setError(result.message);
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg space-y-8 border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
  src="/images/GCLogo.png"
  alt="Logo"
  width={74}
  height={74}
  className="rounded-lg shadow-sm"
  priority
/>
        </div>

        <div className="text-center">
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start space-x-2">
              <svg
                className="h-5 w-5 text-red-400 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            {" "}
            {/* <-- Yahan se 'relative' hata diya */}
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            {/* Sirf input aur button ke liye ek naya relative container banayein */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
                placeholder="Enter your password"
              />

              {/* 👁️ Eye toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {/* Ab yeh icon bilkul input ke andar vertically center hoga */}
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
            <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link
              href="/"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              back to home
            </Link>
          </p>
          </div>
        </form>
      </div>
    </div>
  );
}
