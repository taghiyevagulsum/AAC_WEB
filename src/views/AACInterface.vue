<template>
  <div class="aac-interface">
    <header class="header-bar">
      <div class="sentence-strip-container">
        <div class="sentence-strip">
        <span v-for="(word, index) in sentenceStrip" :key="index">{{ word.text }} </span>
      </div>
        <button class="erase-button" @click="eraseLastWord">X</button>
      </div>
      <div class="button-group">
        <button class="speak-button" @click="speakSentence">
          <img src="/speaker-icon.svg" alt="Speak" class="icon" />
        </button>
        <div class="controls">
          <button class="control-button" @click="logout">
            <img src="/logout-icon.svg" alt="Logout" class="icon" />
          </button>
        </div>
      </div>
    </header>
    <main class="main-grid-area">
      <div v-if="currentView === 'home'" class="grid-container">
        <div v-for="word in uncategorizedWords" :key="word.id" class="card word-card" @click="addWordToSentence(word)">
          <img :src="word.imageUrl || '/word-icon.svg'" :alt="word.text" class="card-icon" />
          <span class="card-label">{{ word.text }}</span>
        </div>
        <div v-for="category in categories" :key="category.id" class="card category-card" @click="navigateToCategory(category.id)">
          <img src="/folder-icon.svg" alt="Category" class="card-icon" />
          <span class="card-label">{{ category.name }}</span>
        </div>
      </div>

      <div v-else-if="currentView === 'category'">
        <div class="back-button-container">
          <button @click="navigateHome" class="back-button control-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </button>
        </div>
        <div class="grid-container">
        <div v-for="word in currentCategoryWords" :key="word.id" class="card word-card" @click="addWordToSentence(word)">
          <img :src="word.imageUrl || '/word-icon.svg'" :alt="word.text" class="card-icon" />
          <span class="card-label">{{ word.text }}</span>
        </div>
      </div>
      </div>
    </main>

    <AddEditModal
        :isVisible="isModalVisible"
        :isEditMode="false"
        :categories="categories"
        @close="closeModal"
        @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';



const sentenceStrip = ref([]);
const vocabulary = ref([]);
const categories = ref([]);
const uncategorizedWords = ref([]);
const currentView = ref('home'); // 'home' or 'category'
const currentCategoryWords = ref([]);

const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'https://goldfish-app-un8nb.ondigitalocean.app/api';

// Function to retrieve the authentication token
// In a real application, this would fetch from localStorage/sessionStorage
// and handle token refresh if necessary.
const getAuthToken = () => {
  const token = localStorage.getItem('jwt_token'); // Assuming you store the token here after login
  if (token) {
    return token;
  } else {
    console.warn("Authentication token not found. Please ensure you are logged in.");
    // Optionally, redirect to a login page or show a prominent login prompt
    // router.push('/login'); // If you are using Vue Router
    return null;
  }
};


const isModalVisible = ref(false);



const fetchCategories = async () => {
  const token = getAuthToken();
  if (!token) {
    console.error("Cannot fetch categories: No authentication token available.");
    return; // Stop execution if no token
  }

  try {
    console.log('Fetching categories...');
    const response = await fetch(`${API_BASE_URL}/categories/getAll`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Use the dynamically retrieved token
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    categories.value = data;
    console.log('Categories fetched:', categories.value);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchVocabulary = async () => {
  const token = getAuthToken();
  if (!token) {
    console.error("Cannot fetch vocabulary: No authentication token available.");
    return; // Stop execution if no token
  }

  try {
    console.log('Fetching vocabulary...');
    const response = await fetch(`${API_BASE_URL}/vocabulary/getAll`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Use the dynamically retrieved token
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    vocabulary.value = data;
    uncategorizedWords.value = data.filter(word => !word.category);
    console.log('Vocabulary fetched:', vocabulary.value);
    console.log('Uncategorized words:', uncategorizedWords.value);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
  }
};

const addWordToSentence = (word) => {
  console.log("Adding word to sentence strip:", word);
  sentenceStrip.value.push(word);
};

const eraseLastWord = () => {
  sentenceStrip.value.pop();
};

const speakSentence = async () => {
  for (const word of sentenceStrip.value) {
    if (word.voiceUrl) {
      try {
        const audio = new Audio(word.voiceUrl);
        await new Promise((resolve, reject) => {
          audio.onended = resolve;
          audio.onerror = (e) => {
            console.error("Audio error event:", e);
            reject(new Error("Audio playback error."));
          };
          audio.play();
        });
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  }
};



const navigateToCategory = (categoryId) => {
  currentCategoryWords.value = vocabulary.value.filter(word => word.category && word.category.id === categoryId);
  currentView.value = 'category';
};

const navigateHome = () => {
  console.log("Navigating back to home.");
  currentView.value = 'home';
};

const router = useRouter();

const logout = () => {
  localStorage.removeItem('jwt_token');
  router.push('/');
};

onMounted(() => {
  // Attempt to get token on mount. Calls will only proceed if a token is found.
  getAuthToken();
  fetchCategories();
  fetchVocabulary();
});
</script>

<style scoped>
/* Styles remain the same as provided */
.aac-interface {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
}

.header-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-bottom: 2px solid #ccc;
}

.sentence-strip-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  background-color: #e0e0e0;
  border-radius: 5px;
  padding: 5px;
  margin-right: 10px;
}

.sentence-strip {
  flex-grow: 1;
  min-height: 40px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  flex-wrap: wrap; /* Allow words to wrap */
  gap: 5px; /* Space between words */
  color: black; /* Ensure visibility */
}

.erase-button {
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  margin-left: 5px;
  cursor: pointer;
  font-weight: bold;
}

.speak-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.speak-button .icon {
  width: 24px;
  height: 24px;
  filter: invert(100%); /* Make icon white */
}

.controls {
  display: flex;
  gap: 10px;
}

.button-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
}

.control-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button .icon {
  width: 24px;
  height: 24px;
  filter: invert(100%); /* Make icon white */
}

.main-grid-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.card {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.category-card {
  background-color: #d0e9ff; /* Light blue for categories */
}

.word-card {
  background-color: #e6ffe6; /* Light green for words */
}

.card-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.card-label {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.back-button {
  background-color: #a7d9ff; /* Pastel blue */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background-color: #8ac8ff;
}
</style>