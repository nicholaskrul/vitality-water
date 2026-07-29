import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LOGO_URL } from '../data';

export const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        alert('Account created! Please check your email to verify your account or sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] flex flex-col items-center justify-center p-6 font-['Inter']">
      <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl border border-[#e7eeff] space-y-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <img src={LOGO_URL} alt="Vitality Water" className="h-12 w-auto object-contain mb-1" />
          <h1 className="font-['Montserrat'] text-2xl font-bold text-[#00677f]">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-[#3c494e]">
            {isSignUp
              ? 'Join Vitality Water to track hydration with friends'
              : 'Log in to sync your hydration goals & leaderboards'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-semibold border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-[#3c494e] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Rivers"
                className="w-full h-11 bg-[#f0f3ff] rounded-xl px-4 text-sm font-medium text-[#111c2d] outline-none focus:ring-2 focus:ring-[#00677f]/20 border border-[#dee8ff]"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#3c494e] block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full h-11 bg-[#f0f3ff] rounded-xl px-4 text-sm font-medium text-[#111c2d] outline-none focus:ring-2 focus:ring-[#00677f]/20 border border-[#dee8ff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#3c494e] block mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 bg-[#f0f3ff] rounded-xl px-4 text-sm font-medium text-[#111c2d] outline-none focus:ring-2 focus:ring-[#00677f]/20 border border-[#dee8ff]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#00677f] hover:bg-[#00566a] text-white rounded-2xl font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="pt-2 border-t border-[#e7eeff]">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
            }}
            className="text-xs font-semibold text-[#00677f] hover:underline cursor-pointer"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};