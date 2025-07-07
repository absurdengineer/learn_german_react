import React, { useState } from 'react';

const Writing: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [userText, setUserText] = useState('');

  const writingExercises = [
    {
      id: 1,
      title: 'Personal Introduction',
      description: 'Write about yourself using basic German phrases',
      level: 'A1',
      icon: '👋',
      color: 'bg-blue-500',
      prompt: 'Write a short introduction about yourself. Include your name, age, where you live, and what you like to do.',
      hints: [
        'Start with "Hallo, ich bin..." (Hello, I am...)',
        'Use "Ich bin ... Jahre alt" (I am ... years old)',
        'Say "Ich wohne in..." (I live in...)',
        'End with "Ich mag..." (I like...)',
      ],
      completed: true,
    },
    {
      id: 2,
      title: 'Daily Routine',
      description: 'Describe your typical day',
      level: 'A1',
      icon: '⏰',
      color: 'bg-green-500',
      prompt: 'Write about your daily routine. What time do you wake up? What do you do during the day?',
      hints: [
        'Use "Ich stehe um ... auf" (I wake up at...)',
        'Use "Ich gehe zur Arbeit/Schule" (I go to work/school)',
        'Use "Am Abend..." (In the evening...)',
        'Use "Ich gehe um ... ins Bett" (I go to bed at...)',
      ],
      completed: false,
    },
    {
      id: 3,
      title: 'Family Description',
      description: 'Write about your family members',
      level: 'A1',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-purple-500',
      prompt: 'Describe your family. Who are the members? What do they do?',
      hints: [
        'Use "Meine Familie ist..." (My family is...)',
        'Use "Mein Vater/Meine Mutter" (My father/mother)',
        'Use "Er/Sie arbeitet als..." (He/She works as...)',
        'Use "Wir wohnen zusammen" (We live together)',
      ],
      completed: false,
    },
    {
      id: 4,
      title: 'Favorite Food',
      description: 'Write about your favorite foods and drinks',
      level: 'A1',
      icon: '🍕',
      color: 'bg-orange-500',
      prompt: 'What is your favorite food? When do you eat it? Do you cook it yourself?',
      hints: [
        'Use "Mein Lieblingsgericht ist..." (My favorite dish is...)',
        'Use "Ich esse gern..." (I like to eat...)',
        'Use "Das schmeckt gut" (That tastes good)',
        'Use "Ich koche..." (I cook...)',
      ],
      completed: false,
    },
    {
      id: 5,
      title: 'Weekend Plans',
      description: 'Write about your weekend activities',
      level: 'A1',
      icon: '🏖️',
      color: 'bg-red-500',
      prompt: 'What do you like to do on weekends? Write about your typical weekend.',
      hints: [
        'Use "Am Wochenende..." (On the weekend...)',
        'Use "Ich gehe gern..." (I like to go...)',
        'Use "Mit meinen Freunden" (With my friends)',
        'Use "Das macht Spaß" (That is fun)',
      ],
      completed: false,
    },
    {
      id: 6,
      title: 'Shopping List',
      description: 'Create a shopping list in German',
      level: 'A1',
      icon: '🛒',
      color: 'bg-indigo-500',
      prompt: 'You need to go shopping. Write a list of items you need to buy and where you will buy them.',
      hints: [
        'Use "Ich brauche..." (I need...)',
        'Use "Im Supermarkt kaufe ich..." (In the supermarket I buy...)',
        'Use "Das kostet..." (That costs...)',
        'Use "Ich bezahle mit..." (I pay with...)',
      ],
      completed: false,
    },
  ];

  const handleStartExercise = (exerciseId: number) => {
    setSelectedExercise(exerciseId);
    setUserText('');
  };

  const handleBackToList = () => {
    setSelectedExercise(null);
    setUserText('');
  };

  const handleSaveText = () => {
    // In a real app, save the text to local storage or backend
    console.log('Saving text:', userText);
    // Show success message
    alert('Your writing has been saved!');
  };

  const selectedExerciseData = writingExercises.find(ex => ex.id === selectedExercise);

  if (selectedExercise && selectedExerciseData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Exercises</span>
            </button>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {selectedExerciseData.level}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Exercise Instructions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`${selectedExerciseData.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                    {selectedExerciseData.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedExerciseData.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {selectedExerciseData.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-2">Prompt:</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                    {selectedExerciseData.prompt}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Helpful Hints:</h3>
                  <div className="space-y-2">
                    {selectedExerciseData.hints.map((hint, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-gray-600">{hint}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Writing
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Words: {userText.split(/\s+/).filter(word => word.length > 0).length}</span>
                    <span>•</span>
                    <span>Characters: {userText.length}</span>
                  </div>
                </div>

                <textarea
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="Start writing your response here..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 leading-relaxed"
                  style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                />

                <div className="flex justify-between items-center mt-6">
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Clear
                    </button>
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Check Grammar
                    </button>
                  </div>
                  <button
                    onClick={handleSaveText}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save & Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Writing Practice ✍️
          </h1>
          <p className="text-lg text-gray-600">
            Improve your German writing skills with guided exercises
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Writing Progress
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">A1 Level</span>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">A1</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {writingExercises.filter(ex => ex.completed).length}
              </div>
              <p className="text-sm text-gray-600">Exercises Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {writingExercises.length}
              </div>
              <p className="text-sm text-gray-600">Total Exercises</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Math.round((writingExercises.filter(ex => ex.completed).length / writingExercises.length) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Progress</p>
            </div>
          </div>
        </div>

        {/* Writing Exercises */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Writing Exercises
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {writingExercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
                onClick={() => handleStartExercise(exercise.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`${exercise.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                        {exercise.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exercise.title}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                            {exercise.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {exercise.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          {exercise.completed && (
                            <div className="flex items-center space-x-1 text-green-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white p-6 mt-8">
          <div className="text-center">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-xl font-semibold mb-2">
              Writing Tips
            </h3>
            <div className="text-purple-100 text-sm space-y-1">
              <p>• Start with simple sentences and gradually make them more complex</p>
              <p>• Use the hints provided to help structure your writing</p>
              <p>• Don't worry about perfect grammar - focus on expressing your ideas</p>
              <p>• Practice regularly to improve your German writing skills</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Writing;
