const AccessDenied = () => {
  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0" />
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 text-center">
        <img
          src="/access-denied.png"
          alt="Truy cập bị từ chối"
          className="w-full max-w-sm drop-shadow-lg"
        />
        <div className="mt-8 text-6xl text-primary">Access denied</div>
      </div>
    </div>
  );
};

export default AccessDenied;
