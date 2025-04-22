
const BackgroundGradient = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        style={{ 
          backgroundSize: "400% 400%",
          animation: "gradient-flow 15s ease infinite"
        }}
      />
      <div className="absolute top-20 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-40 right-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "3s" }} />
    </div>
  );
};

export default BackgroundGradient;
