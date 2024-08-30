"use client"

import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';

export function Appbar() {
    const session = useSession()
    
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="font-bold text-xl text-gray-800">
                            Your Logo
                        </Link>
                    </div>
                    <div >
                        <Link href="/" className="text-gray-700 hover:text-gray-900">
                            Home
                        </Link>
                        </div>
                        <div>
                        <Link href="/pricing" className="text-gray-700 hover:text-gray-900">
                            Pricing
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {session.data?.user ? (
                            <>
                                <span className="text-gray-700">
                                    {session.data.user.name || session.data.user.email}
                                </span>
                                <button 
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                                    onClick={() => signOut()}
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <button 
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out flex items-center"
                                onClick={handleGoogleSignIn}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                                </svg>
                                Sign in with Google
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}