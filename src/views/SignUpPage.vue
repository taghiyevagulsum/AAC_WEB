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

const handleSignUp = () => {
  // In a real application, you would send a request to your backend here
  // For now, we'll just navigate to the AAC interface
  console.log('Attempting to sign up with:', name.value, email.value, password.value);
  router.push('/aac');
};
</script>

<style scoped>
.signup-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
