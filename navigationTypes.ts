export type RootStackParamList = {
    Workout: undefined; // L'écran Workout ne prend aucun paramètre
    ExerciseDetails: { exercise: Exercise }; // L'écran ExerciseDetails prend un paramètre `exercise`
  };
  
  export type Exercise = {
    exercise_id: number;
    name: string;
    description: string;
    difficulty: string;
    muscle_group: string;
    image: string;
  };