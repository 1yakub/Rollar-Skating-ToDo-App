import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, VStack, HStack, Text, Input, Button, Badge, useToast, Select } from '@chakra-ui/react';
import { CheckIcon, DeleteIcon, StarIcon, AddIcon } from '@chakra-ui/icons';
import useSound from 'use-sound';
import { Todo } from '../models/Todo';
import { v4 as uuidv4 } from 'uuid';

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Todo['difficulty']>('beginner');
  const [selectedStyle, setSelectedStyle] = useState<Todo['skatingStyle']>('freestyle');
  const toast = useToast();

  // Sound effects
  const [playComplete] = useSound('/sounds/complete.mp3');
  const [playAdd] = useSound('/sounds/add.mp3');
  const [playDelete] = useSound('/sounds/delete.mp3');

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('skating-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('skating-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: uuidv4(),
      title: newTodoTitle,
      completed: false,
      difficulty: selectedDifficulty,
      skatingStyle: selectedStyle,
      createdAt: new Date(),
      points: calculatePoints(selectedDifficulty),
      streakCount: 0,
    };

    setTodos([...todos, newTodo]);
    setNewTodoTitle('');
    playAdd();
    
    toast({
      title: "New trick added! 🛼",
      description: "Let's nail this skating move!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right"
    });
  };

  const calculatePoints = (difficulty: Todo['difficulty']): number => {
    switch (difficulty) {
      case 'beginner': return 10;
      case 'intermediate': return 20;
      case 'advanced': return 30;
      default: return 10;
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        if (completed) {
          playComplete();
          toast({
            title: `Awesome move! 🌟 +${todo.points} points!`,
            description: "You're getting better every day!",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top-right"
          });
        }
        return {
          ...todo,
          completed,
          completedAt: completed ? new Date() : undefined,
          streakCount: completed ? todo.streakCount + 1 : todo.streakCount,
        };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    playDelete();
  };

  const getTotalPoints = () => {
    return todos.reduce((total, todo) => total + (todo.completed ? todo.points : 0), 0);
  };

  return (
    <VStack spacing={4} width="100%" maxW="600px" p={4}>
      <Text fontSize="2xl" fontWeight="bold" color="purple.500">
        🛼 Mirpur Roller Skating Club Tasks 🛼
      </Text>
      
      <Text fontSize="lg" color="gray.600">
        Total Points: {getTotalPoints()} 🏆
      </Text>

      <Box width="100%" bg="white" p={4} borderRadius="lg" boxShadow="sm">
        <VStack spacing={3}>
          <Input
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new skating trick or task..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          
          <HStack width="100%">
            <Select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Todo['difficulty'])}
            >
              <option value="beginner">Beginner (10pts)</option>
              <option value="intermediate">Intermediate (20pts)</option>
              <option value="advanced">Advanced (30pts)</option>
            </Select>
            
            <Select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as Todo['skatingStyle'])}
            >
              <option value="freestyle">Freestyle</option>
              <option value="speed">Speed</option>
              <option value="dance">Dance</option>
              <option value="slalom">Slalom</option>
            </Select>
            
            <Button
              colorScheme="purple"
              onClick={addTodo}
              leftIcon={<AddIcon />}
            >
              Add
            </Button>
          </HStack>
        </VStack>
      </Box>

      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            style={{ width: '100%' }}
            layout
          >
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              width="100%"
              bg={todo.completed ? 'green.50' : 'white'}
              position="relative"
              overflow="hidden"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'md'
              }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 0%, transparent 97%, purple.200 100%)',
                opacity: 0.1,
              }}
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text
                    fontSize="lg"
                    textDecoration={todo.completed ? 'line-through' : 'none'}
                    color={todo.completed ? 'gray.500' : 'black'}
                  >
                    {todo.title}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="purple">{todo.skatingStyle}</Badge>
                    <Badge colorScheme="blue">{todo.difficulty}</Badge>
                    <Badge colorScheme="green">{todo.points}pts</Badge>
                    {todo.streakCount > 0 && (
                      <Badge colorScheme="orange">
                        <StarIcon mr={1} />
                        {todo.streakCount}
                      </Badge>
                    )}
                  </HStack>
                </VStack>
                <HStack>
                  <Button
                    size="sm"
                    colorScheme={todo.completed ? 'green' : 'gray'}
                    onClick={() => toggleTodo(todo.id)}
                    variant={todo.completed ? 'solid' : 'outline'}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteTodo(todo.id)}
                    variant="ghost"
                  >
                    <DeleteIcon />
                  </Button>
                </HStack>
              </HStack>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </VStack>
  );
}; 