import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, VStack, HStack, Text, Input, Button, Badge, useToast } from '@chakra-ui/react';
import { CheckIcon, DeleteIcon, StarIcon } from '@chakra-ui/icons';
import useSound from 'use-sound';
import { Todo } from '../models/Todo';
import { v4 as uuidv4 } from 'uuid';

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const toast = useToast();

  // Sound effects - you'll need to add actual sound files
  const [playComplete] = useSound('/sounds/complete.mp3');
  const [playAdd] = useSound('/sounds/add.mp3');
  const [playDelete] = useSound('/sounds/delete.mp3');

  const addTodo = () => {
    if (!newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: uuidv4(),
      title: newTodoTitle,
      completed: false,
      difficulty: 'beginner',
      skatingStyle: 'freestyle',
      createdAt: new Date(),
      points: 10,
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
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        if (completed) {
          playComplete();
          toast({
            title: "Awesome move! 🌟",
            description: "You're getting better every day!",
            status: "success",
            duration: 2000,
            isClosable: true,
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

  return (
    <VStack spacing={4} width="100%" maxW="600px" p={4}>
      <Text fontSize="2xl" fontWeight="bold" color="purple.500">
        🛼 Mirpur Roller Skating Club Tasks 🛼
      </Text>

      <HStack width="100%">
        <Input
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new skating trick or task..."
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <Button colorScheme="purple" onClick={addTodo}>
          Add
        </Button>
      </HStack>

      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            style={{ width: '100%' }}
          >
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              width="100%"
              bg={todo.completed ? 'green.50' : 'white'}
              position="relative"
              overflow="hidden"
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
                    textDecoration={todo.completed ? 'line-through' : 'none'}
                    color={todo.completed ? 'gray.500' : 'black'}
                  >
                    {todo.title}
                  </Text>
                  <HStack spacing={2}>
                    <Badge colorScheme="purple">{todo.skatingStyle}</Badge>
                    <Badge colorScheme="blue">{todo.difficulty}</Badge>
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
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={() => deleteTodo(todo.id)}
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