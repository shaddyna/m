// utils/api.ts
const API_URL = 'https://malexbackend.onrender.com/api/users';

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Registration failed');
  }

  return await response.json();
};


// utils/api.ts
export const loginUser = async (userData: {
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.msg || 'Login failed');
    }
  
    const data = await response.json();
    // Store the token in localStorage or cookies
    localStorage.setItem('authToken', data.data.token);
    return data;
  };

  
// Get all users (Admin only)
export const getAllUsers = async (token: string, queryParams = {}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const response = await fetch(`${API_URL}?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Failed to fetch users');
  }

  return await response.json();
};

// Get single user (Admin only)
export const getUser = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Failed to fetch user');
  }

  return await response.json();
};

// Update user (Admin or owner)
export const updateUser = async (id: string, userData: any, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Failed to update user');
  }

  return await response.json();
};

// Delete user (Admin only)
export const deleteUser = async (id: string, token: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Failed to delete user');
  }

  return await response.json();
};

// Get current user profile
export const getCurrentUser = async (token: string) => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Failed to fetch profile');
  }

  return await response.json();
};

// Update current user profile
export const updateCurrentUser = async (userData: any, token: string) => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors?.[0]?.msg || 'Failed to update profile');
  }

  return await response.json();
};