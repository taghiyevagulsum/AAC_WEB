<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';

onMounted(() => {
  console.log('App.vue has been mounted!');
});
</script>

<template>
  <RouterView />
</template>

<style scoped>
/* Global styles for high-contrast and accessibility */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: white; /* Ensure a clean white background */
  color: #333; /* Default text color */
}

/* High-contrast buttons */
button {
  background-color: #007bff; /* A strong, clear blue */
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

/* High-contrast input fields */
input[type="text"],
input[type="email"],
input[type="password"],
select {
  border: 2px solid #007bff; /* Clear border */
  padding: 10px;
  border-radius: 5px;
  font-size: 1em;
  color: #333;
  background-color: #f9f9f9;
}

input:focus,
select:focus {
  border-color: #0056b3;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

/* Links */
a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  color: #1a1a1a;
}
</style>