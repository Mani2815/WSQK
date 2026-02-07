<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 50 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 50 }}
  className={`
    fixed inset-0 flex items-center justify-center z-90
  `}
>
  <div
    className={`
      w-full max-w-lg bg-black border-4 p-8 relative
      ${isPossessed ? 'border-terminal-red' : 'border-terminal-green'}
    `}
    style={{
      boxShadow: isPossessed
        ? '0 0 60px rgba(255, 0, 102, 0.6)'
        : '0 0 60px rgba(0, 255, 65, 0.4)'
    }}
  >
    {/* Close button */}
    <button
      onClick={onClose}
      className={`
        absolute top-4 right-4 text-2xl
        ${isPossessed ? 'text-terminal-red' : 'text-terminal-green'}
      `}
    >
      ✕
    </button>

    {/* — keep the rest as is — */}
    { /* Step Icon, Title, Description, Buttons, etc */ }
  </div>
</motion.div>
