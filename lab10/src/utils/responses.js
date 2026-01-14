export const ok = (data, meta = {}) => ({ 
  data, 
  error: null, 
  meta 
});

export const fail = (message, details = null, meta = {}) => ({
  data: null,
  error: { 
    message, 
    ...(details ? { details } : {}) 
  },
  meta
});