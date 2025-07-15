<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Edit Item' : 'Add to Grid' }}</h2>
        <button class="close-button" @click="closeModal">X</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="itemName" placeholder="Enter name" />
        </div>

        <div class="form-group">
          <label>What are you adding?</label>
          <div class="radio-group">
            <label>
              <input type="radio" value="word" v-model="itemType" /> A Word
            </label>
            <label>
              <input type="radio" value="category" v-model="itemType" /> A Category
            </label>
          </div>
        </div>

        <div class="form-group" v-if="itemType === 'word'">
          <label for="category">Choose a Category</label>
          <select id="category" v-model="selectedCategory">
            <option value="">-- Select a Category --</option>
            <!-- Options will be dynamically loaded -->
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Choose an Image</label>
          <div class="image-selection">
            <input type="text" v-model="imageUrl" placeholder="Enter Image URL or Search Icon Library" />
            <input type="file" @change="handleImageUpload" accept="image/*" ref="imageUploadInput" style="display: none;" />
            <button @click="triggerImageUpload">Upload Your Own</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button v-if="isEditMode" class="delete-button">Delete Item</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
        <button class="save-button" @click="saveItem">{{ isEditMode ? 'Save Changes' : 'Save to Grid' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  isVisible: Boolean,
  isEditMode: Boolean,
  initialData: Object, // For pre-populating fields in edit mode
  categories: Array // Pass categories from parent
});

const emit = defineEmits(['close', 'save']);

const itemName = ref('');
const itemType = ref('word'); // Default to 'word'
const selectedCategory = ref('');
const imageUrl = ref('');
const categories = ref([]);
const imageUploadInput = ref(null);

const triggerImageUpload = () => {
  imageUploadInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

watch(() => props.initialData, (newData) => {
  if (newData) {
    itemName.value = newData.name || '';
    itemType.value = newData.type || 'word';
    selectedCategory.value = newData.categoryId || '';
    imageUrl.value = newData.imageUrl || '';
  }
}, { immediate: true });

watch(() => props.categories, (newCategories) => {
  if (newCategories) {
    categories.value = newCategories;
  }
}, { immediate: true });

const closeModal = () => {
  emit('close');
};

const saveItem = () => {
  // Logic to save item
  emit('save', { itemName: itemName.value, itemType: itemType.value, selectedCategory: selectedCategory.value, imageUrl: imageUrl.value });
  closeModal();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.8em;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #666;
}

.modal-body {
  flex-grow: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
}

.radio-group label {
  margin-right: 20px;
  font-weight: normal;
}

.image-selection {
  display: flex;
  gap: 10px;
}

.image-selection input {
  flex-grow: 1;
}

.image-selection button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 20px;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: auto; /* Pushes other buttons to the right */
}
</style>
