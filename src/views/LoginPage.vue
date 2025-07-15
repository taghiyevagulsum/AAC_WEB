<template>
  <div class="login-page">
    <h1>Login to SpeakGrid</h1>
    <form @submit.prevent="handleLogin">
      <input type="email" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
      <button type="submit">Login</button>
    </form>
    <router-link to="/signup">Don't have an account? Sign Up</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = () => {
  // In a real application, you would send a request to your backend here
  // For now, we'll just navigate to the AAC interface
  console.log('Attempting to log in with:', email.value, password.value);
  router.push('/aac');
};

onMounted(() => {
  console.log('LoginPage.vue has been mounted!');
});
</script>

<style scoped>
.login-page {
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
