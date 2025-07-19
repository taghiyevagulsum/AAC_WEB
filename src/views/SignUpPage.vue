<template>
  <div class="signup-page">
    <h1>Create Your SpeakGrid Account</h1>
    <form @submit.prevent="handleSignUp">
      <input type="text" placeholder="Your Name" v-model="name" />
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Sign Up</button>
    </form>
    <router-link to="/">Already have an account? Login</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();

const API_BASE_URL = 'http://localhost:8080/api';

const handleSignUp = async () => {
  console.log('Attempting to sign up with:', name.value, email.value, password.value);

  try {
    // 1. Register the user
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
      }),
    });

    if (!registerResponse.ok) {
      const errorText = await registerResponse.text();
      throw new Error(`Registration failed: HTTP error! status: ${registerResponse.status}, message: ${errorText}`);
    }

    console.log('Registration successful!');

    // 2. Automatically log in the user after successful registration
    const loginResponse = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      throw new Error(`Login failed after registration: HTTP error! status: ${loginResponse.status}, message: ${errorText}`);
    }

    const data = await loginResponse.json();
    console.log('Login successful after registration! Token:', data.token);
    localStorage.setItem('jwt_token', data.token);
    router.push('/aac');

  } catch (error) {
    console.error('Sign up process failed:', error);
    alert(`Sign up failed: ${error.message}`);
  }
};
</script>

<style scoped>
.signup-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh; /* Ensure it takes full viewport height */
  background-color: white;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5em;
  margin-bottom: 1em;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  width: 300px;
  gap: 15px;
  margin-bottom: 20px;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

router-link {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9em;
}

router-link:hover {
  text-decoration: underline;
}
</style>
