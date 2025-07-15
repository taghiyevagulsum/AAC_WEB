<template>
  <div class="aac-interface">
    <header class="header-bar">
      <div class="sentence-strip-container">
        <div class="sentence-strip">{{ sentenceStrip }}</div>
        <button class="erase-button" @click="eraseLastWord">X</button>
      </div>
      <button class="speak-button" @click="speakSentence">
          <img src="/speaker-icon.svg" alt="Speak" class="icon" />
        </button>
        <div class="controls">
          <button class="control-button">
            <img src="/grid-icon.svg" alt="Grid Size" class="icon" />
          </button>
          <button class="control-button" @click="openModal">
            <img src="/add-edit-icon.svg" alt="Add/Edit Mode" class="icon" />
          </button>
          <button class="control-button">
            <img src="/logout-icon.svg" alt="Logout" class="icon" />
        </button>
      </div>
    </header>
    <main class="main-grid-area">
      <div v-if="currentView === 'home'" class="grid-container">
        <div v-for="category in categories" :key="category.id" class="card category-card" @click="navigateToCategory(category.id)">
          <img src="/folder-icon.svg" alt="Category" class="card-icon" />
          <span class="card-label">{{ category.name }}</span>
        </div>
      </div>

      <div v-else-if="currentView === 'category'" class="grid-container">
        <button @click="navigateHome" class="back-button">Back to Home</button>
        <div v-for="word in currentCategoryWords" :key="word.id" class="card word-card" @click="addWordToSentence(word.text)">
          <img :src="word.imageUrl || '/word-icon.svg'" :alt="word.text" class="card-icon" />
          <span class="card-label">{{ word.text }}</span>
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
import AddEditModal from '../components/AddEditModal.vue';

const sentenceStrip = ref('');
const vocabulary = ref([]);
const categories = ref([]);
const currentView = ref('home'); // 'home' or 'category'
const currentCategoryWords = ref([]);
const isModalVisible = ref(false);

const openModal = () => {
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
};

const saveItemToBackend = async (item) => {
  const url = item.itemType === 'word' ? `${API_BASE_URL}/vocabulary/add` : `${API_BASE_URL}/categories/add`;
  const body = item.itemType === 'word' ? {
    text: item.itemName,
    imageUrl: item.imageUrl,
    category: { id: item.selectedCategory }
  } : {
    name: item.itemName,
    imageUrl: item.imageUrl
  };

  console.log('Sending body:', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    console.log(`${item.itemType} saved successfully! Response:`, data);
  } catch (error) {
    console.error(`Error saving ${item.itemType}:`, error);
  }
};

const handleSave = async (item) => {
  await saveItemToBackend(item);
  fetchVocabulary();
  fetchCategories();
};

const API_BASE_URL = 'http://localhost:8080/api';
// const API_BASE_URL = 'https://goldfish-app-un8nb.ondigitalocean.app/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN1c2VyQG1haWwuY29tIiwiaWF0IjoxNzUyNTkyODMzLCJleHAiOjE3NTI2NzkyMzN9.MthoLopyAqLBpdIRCHzgCm0s16HEr400pa5cmEZmhbU'; // Replace with dynamic token from login

const fetchCategories = async () => {
  try {
    console.log('Fetching categories...');
    const response = await fetch(`${API_BASE_URL}/categories/getAll`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
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
  try {
    console.log('Fetching vocabulary...');
    const response = await fetch(`${API_BASE_URL}/vocabulary/getAll`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    const data = await response.json();
    vocabulary.value = data;
    console.log('Vocabulary fetched:', vocabulary.value);
  } catch (error) {
    console.error('Error fetching vocabulary:', error);
  }
};

const addWordToSentence = (word) => {
  sentenceStrip.value += (sentenceStrip.value ? ' ' : '') + word;
};

const eraseLastWord = () => {
  const words = sentenceStrip.value.split(' ');
  words.pop();
  sentenceStrip.value = words.join(' ');
};

const speakSentence = () => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(sentenceStrip.value);
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Text-to-speech not supported in this browser.');
  }
};

const navigateToCategory = (categoryId) => {
  currentCategoryWords.value = vocabulary.value.filter(word => word.category && word.category.id === categoryId);
  currentView.value = 'category';
};

const navigateHome = () => {
  currentView.value = 'home';
};

onMounted(() => {
  fetchCategories();
  fetchVocabulary();
});
</script>

<style scoped>
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

.back-button {
  background-color: #6c757d;
  margin-bottom: 20px;
  align-self: flex-start;
}

.back-button:hover {
  background-color: #5a6268;
}
</style>
