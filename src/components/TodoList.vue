<template>
  <div>
    <button @click="toggleFilterVisible">Toggle Filters</button>
    <button @click="toggleOtherVisible">Toggle Other</button>
    <input type="text" class="todo-input" placeholder="What needs to be done" v-model="state.newTodo" @keyup.enter="addTodo">
    <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
    <div v-for="todo in todosFiltered" :key="todo.id" class="todo-item">
      <div class="todo-item-left">
        <input type="checkbox" v-model="todo.completed">
        <div v-if="!todo.editing" @dblclick="editTodo(todo)" class="todo-item-label" :class="{ completed : todo.completed }">{{ todo.title }}</div>
        <input v-else class="todo-item-edit" type="text" v-model="todo.title" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)" v-focus>
      </div>
      <div class="remove-item" @click="removeTodo(todo.id)">
        &times;
      </div>
    </div>
    </transition-group>

    <div class="extra-container">
      <div><label><input type="checkbox" :checked="!anyRemaining" @change="checkAllTodos"> Check All</label></div>
      <div>{{ remaining }} items left</div>
    </div>

    <div v-if="isFilterVisible" class="extra-container">
      <div>
        <button :class="{ active: state.filter == 'all' }" @click="state.filter = 'all'">All</button>
        <button :class="{ active: state.filter == 'active' }" @click="state.filter = 'active'">Active</button>
        <button :class="{ active: state.filter == 'completed' }" @click="state.filter = 'completed'">Completed</button>
      </div>

      <div>
        <transition name="fade">
        <button v-if="showClearCompletedButton" @click="clearCompleted">Clear Completed</button>
        </transition>
      </div>

    </div>

    <div v-if="isOtherVisible" class="extra-container">
      Other stuff here
    </div>
  </div>
</template>

<script>
import { reactive, ref, computed, onMounted } from '@vue/composition-api'
import { useToggle } from '@/functions/useToggle'

export default {
  name: 'todo-list',
  props: {
    title: {
      type: String,
      required: true,
    }
  },
  setup(props) {
    onMounted(() => {
      console.log(props.title)
    })

    let state = reactive({
      newTodo: '', // Add todo
      idForTodo: 3, // Add todo
      beforeEditCache: '', // Edit todo
      filter: 'all', // Filter todo
      todos: [
        {
          'id': 1,
          'title': 'Finish Vue Screencast',
          'completed': false,
          'editing': false,
        },
        {
          'id': 2,
          'title': 'Take over world',
          'completed': false,
          'editing': false,
        },
      ]
    })

    function addTodo() {
      if (state.newTodo.trim().length === 0) {
        return
      }

      state.todos.push({
        id: state.idForTodo,
        title: state.newTodo,
        completed: false,
        editing: false,
      })

      state.newTodo = ''
      state.idForTodo++
    }

    // Edit todo
    function editTodo(todo) {
      state.beforeEditCache = todo.title
      todo.editing = true
    }

    // Edit todo
    function doneEdit(todo) {
      if (todo.title.trim() === '') {
        todo.title = state.beforeEditCache
      }
      todo.editing = false
    }

    // Edit todo
    function cancelEdit(todo) {
      todo.title = state.beforeEditCache
      todo.editing = false
    }

    // Delete todo
    function removeTodo(id) {
      state.todos = state.todos.filter(todo => id !== todo.id)
    }

    // Check all todos
    function checkAllTodos() {
      state.todos.forEach(todo => todo.completed = event.target.checked)
    }

    // Clear completed
    function clearCompleted() {
      state.todos = state.todos.filter(todo => !todo.completed)
    }

    const remaining = computed(() => state.todos.filter(todo => !todo.completed).length)

    const anyRemaining = computed(() => remaining !== 0)

    const showClearCompletedButton = computed(() => state.todos.filter(todo => todo.completed).length > 0)

    const todosFiltered = computed(() => {
      if (state.filter == 'all') {
        return state.todos
      } else if (state.filter == 'active') {
        return state.todos.filter(todo => !todo.completed)
      } else if (state.filter == 'completed') {
        return state.todos.filter(todo => todo.completed)
      }

      return state.todos
    })

    const { isVisible: isFilterVisible, toggleVisible: toggleFilterVisible } = useToggle()
    const { isVisible: isOtherVisible, toggleVisible: toggleOtherVisible } = useToggle()

    // const isFilterVisible = ref(true)

    // function toggleFilterVisible() {
    //   isFilterVisible.value = !isFilterVisible.value
    // }

    return {
      state,
      addTodo,
      editTodo,
      doneEdit,
      cancelEdit,
      removeTodo,
      checkAllTodos,
      clearCompleted,
      remaining,
      anyRemaining,
      todosFiltered,
      showClearCompletedButton,
      isFilterVisible,
      toggleFilterVisible,
      isOtherVisible,
      toggleOtherVisible,
    }
  },

  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  },
}
</script>

<style lang="scss">
  @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

  .todo-input {
    width: 100%;
    padding: 10px 18px;
    font-size: 18px;
    margin-bottom: 16px;

    &:focus {
      outline: 0;
    }
  }

  .todo-item {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation-duration: 0.3s;
  }

  .remove-item {
    cursor: pointer;
    margin-left: 14px;
    &:hover {
      color: black;
    }
  }

  .todo-item-left {
    display: flex;
    align-items: center;
  }

  .todo-item-label {
    padding: 10px;
    border: 1px solid white;
    margin-left: 12px;
  }

  .todo-item-edit {
    font-size: 24px;
    color: #2c3e50;
    margin-left: 12px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;

    &:focus {
      outline: none;
    }
  }

  .completed {
    text-decoration: line-through;
    color: grey;
  }

  .extra-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    border-top: 1px solid lightgrey;
    padding-top: 14px;
    margin-bottom: 14px;
  }

  button {
    font-size: 14px;
    background-color: white;
    appearance: none;

    &:hover {
      background: lightgreen;
    }

    &:focus {
      outline: none;
    }
  }

  .active {
    background: lightgreen;
  }

  // CSS Transitions
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
