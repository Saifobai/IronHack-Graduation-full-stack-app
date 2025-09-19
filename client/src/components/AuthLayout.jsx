const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
        ClipoFrameAI
      </h1>
      <p className="text-sm text-center text-gray-400 mb-8">{subtitle}</p>
      <div className="bg-gray-900 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
