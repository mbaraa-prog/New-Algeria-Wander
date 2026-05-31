import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] px-6">
            <div className="bg-white rounded-[40px] p-14 shadow-xl border border-gray-100 w-full max-w-md space-y-10">
                <div className="space-y-3">
                    <Link to="/login" className="inline-flex items-center text-[#006699] text-sm font-bold hover:underline space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Login</span>
                    </Link>
                    <h1 className="text-[#0F4C81] text-4xl font-extrabold">Reset Password</h1>
                    <p className="text-gray-400 font-medium">Enter your email and we'll send you a reset link.</p>
                </div>

                {submitted ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center space-y-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-green-700 font-bold">Check your inbox!</p>
                        <p className="text-green-600 text-sm">If an account exists for <strong>{email}</strong>, a reset link has been sent.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[#0F4C81] text-sm font-bold ml-1">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-[#F8FAFF] rounded-2xl py-4 px-6 text-sm outline-none border-2 border-transparent focus:border-[#006699] focus:bg-white transition-all font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#006699] text-white py-4 rounded-2xl font-bold hover:bg-[#004d73] transition-all shadow-xl shadow-blue-100"
                        >
                            Send Reset Link
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;