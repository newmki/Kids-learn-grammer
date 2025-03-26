// KidsGramner App - Main JavaScript
// Created by MG1999, 2025 version

document.addEventListener('DOMContentLoaded', function() {
    // App state management
    const appState = {
        points: 0,
        currentSection: 'home',
        wordsLearned: 0,
        storiesRead: 0,
        exercisesCompleted: 0,
        quizzesCompleted: 0,
        wordPoints: 0,
        exercisePoints: 0,
        storyPoints: 0,
        learningPoints: 0,
        currentDay: 1,
        completedDays: [],
        achievements: [],
        username: 'Young Learner',
        daysActive: 0,
        motivationalPhrases: [
            "Learning is fun! Keep exploring!",
            "You're doing great! Keep it up!",
            "Every word you learn makes you smarter!",
            "Stories open new worlds for you!",
            "Practice makes perfect!",
            "You're a star learner!",
            "Keep growing your knowledge!",
            "Your brain is getting stronger!",
            "Learning is an adventure!",
            "You're becoming so wise!"
        ]
    };

    // Load app state from localStorage if available
    loadAppState();

    // Initialize the app
    initializeApp();

    // Event listeners for navigation
    setupEventListeners();

    // Load initial content
    loadContent(appState.currentSection);
    updatePointsDisplay();
    updateMotivation();

    // Side menu toggle functionality
    function toggleSideMenu() {
        const sideMenu = document.getElementById('sideMenu');
        sideMenu.classList.toggle('active');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', toggleSideMenu);
        document.getElementById('closeMenu').addEventListener('click', toggleSideMenu);

        // Side menu navigation
        const sideMenuItems = document.querySelectorAll('.side-menu li');
        sideMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                navigateToSection(section);
                toggleSideMenu();
            });
        });

        // Bottom navigation
        const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                if (section === 'points') {
                    showPointsModal();
                } else {
                    navigateToSection(section);
                }
            });
        });

        // Feature cards on home screen
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('click', function() {
                const section = this.getAttribute('data-section');
                navigateToSection(section);
            });
        });

        // Alphabet buttons
        const alphabetButtons = document.querySelectorAll('.alphabet-btn');
        alphabetButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const letter = this.getAttribute('data-letter');
                loadAlphabetWords(letter);
                
                // Mark active button
                alphabetButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Number range buttons
        const numberRangeBtns = document.querySelectorAll('.number-range-btn');
        numberRangeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const range = this.getAttribute('data-range');
                loadNumbersRange(range);
                
                // Mark active button
                numberRangeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Grammar navigation
        const grammarNavBtns = document.querySelectorAll('.grammar-nav-btn');
        grammarNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const topic = this.getAttribute('data-topic');
                loadGrammarTopic(topic);
                
                // Mark active button
                grammarNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Stories category buttons
        const storyCatBtns = document.querySelectorAll('.story-cat-btn');
        storyCatBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                loadStoryCategory(category);
                
                // Mark active button
                storyCatBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Math topic buttons
        const mathNavBtns = document.querySelectorAll('.math-nav-btn');
        mathNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const topic = this.getAttribute('data-topic');
                loadMathTopic(topic);
                
                // Mark active button
                mathNavBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Number spelling quiz
        document.getElementById('checkNumberSpelling').addEventListener('click', checkNumberSpelling);

        // Fill in blanks exercise
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        document.getElementById('checkFillBlank').addEventListener('click', checkFillBlankAnswer);

        // Reading exercise
        document.getElementById('checkReadingAnswers').addEventListener('click', checkReadingAnswers);

        // Writing task
        document.getElementById('saveWriting').addEventListener('click', saveWritingTask);

        // Story reader back button
        document.getElementById('backToStories').addEventListener('click', function() {
            document.getElementById('storiesList').style.display = 'grid';
            document.getElementById('storyReader').classList.remove('active');
        });

        // Complete lesson button
        document.getElementById('completeLesson').addEventListener('click', completeCurrentLesson);

        // Profile actions
        document.getElementById('resetProgress').addEventListener('click', confirmResetProgress);
        document.getElementById('changeUsername').addEventListener('click', promptChangeUsername);

        // Points modal
        document.querySelector('.points-display').addEventListener('click', showPointsModal);
        document.querySelector('.close-modal').addEventListener('click', hidePointsModal);
        document.getElementById('pointsModalClose').addEventListener('click', hidePointsModal);
    }

    // Initialize app components
    function initializeApp() {
        // Initialize course calendar
        initializeCourseCalendar();
        
        // Load initial number range
        loadNumbersRange('1-20');
        
        // Load initial story category
        loadStoryCategory('interesting');
        
        // Generate a random number for the quiz
        generateNumberQuiz();
        
        // Setup math practice questions
        setupMathPractice();
    }

    // Navigate to section
    function navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
            appState.currentSection = section;
            
            // Update bottom nav active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeNavItem = document.querySelector(`.nav-item[data-section="${section}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
            
            // Special section initializations
            if (section === 'words' && !document.querySelector('.alphabet-btn.active')) {
                // Auto-select first letter if none selected
                document.querySelector('.alphabet-btn').click();
            }
            
            if (section === 'profile') {
                updateProfileDisplay();
            }
        }
        
        saveAppState();
    }

    // Load Alphabet Words
    function loadAlphabetWords(letter) {
        const wordsContainer = document.getElementById('wordsList');
        const letterDisplay = document.getElementById('selectedLetter');
        
        letterDisplay.textContent = `Letter ${letter}`;
        wordsContainer.innerHTML = '';
        
        // Generate words for the selected letter
        const words = generateWordsForLetter(letter);
        
        words.forEach(word => {
            const wordCard = document.createElement('div');
            wordCard.className = 'word-card';
            
            const wordHeader = document.createElement('h4');
            wordHeader.textContent = word.word;
            
            const wordPronunciation = document.createElement('p');
            wordPronunciation.textContent = word.pronunciation;
            
            const wordMeaning = document.createElement('p');
            wordMeaning.textContent = word.meaning;
            
            wordCard.appendChild(wordHeader);
            wordCard.appendChild(wordPronunciation);
            wordCard.appendChild(wordMeaning);
            
            wordCard.addEventListener('click', function() {
                // Mark word as learned and award points
                learnWord(word.word);
            });
            
            wordsContainer.appendChild(wordCard);
        });
    }

    // Generate sample words for a letter
    function generateWordsForLetter(letter) {
        const wordsList = [];
        
        // This is a simplified version - in a real app, you'd have a comprehensive database
        // of words for each letter. Here we're generating a small sample.
        const sampleWords = {
            'A': [
                {word: 'Apple', pronunciation: '/ˈæp.əl/', meaning: 'A round fruit with red, green, or yellow skin'},
                {word: 'Animal', pronunciation: '/ˈæn.ɪ.məl/', meaning: 'A living thing that can move around'},
                {word: 'Ant', pronunciation: '/ænt/', meaning: 'A small insect that lives in groups'},
                {word: 'Arrow', pronunciation: '/ˈær.oʊ/', meaning: 'A thin, straight stick with a sharp point'},
                {word: 'Astronaut', pronunciation: '/ˈæs.trə.nɔːt/', meaning: 'A person who travels in space'},
                {word: 'Adventure', pronunciation: '/ədˈven.tʃər/', meaning: 'An exciting or unusual experience'},
                {word: 'Airplane', pronunciation: '/ˈer.pleɪn/', meaning: 'A flying vehicle with wings'},
                {word: 'Alphabet', pronunciation: '/ˈæl.fə.bet/', meaning: 'The set of letters used to write a language'},
                {word: 'Art', pronunciation: '/ɑːrt/', meaning: 'Drawing, painting, or other creative activities'}
            ],
            'B': [
                {word: 'Ball', pronunciation: '/bɔːl/', meaning: 'A round object used in games'},
                {word: 'Banana', pronunciation: '/bəˈnæn.ə/', meaning: 'A long curved fruit with yellow skin'},
                {word: 'Book', pronunciation: '/bʊk/', meaning: 'Pages with words and pictures bound together'},
                {word: 'Bird', pronunciation: '/bɜːrd/', meaning: 'An animal with wings, feathers, and a beak'},
                {word: 'Butterfly', pronunciation: '/ˈbʌt.ər.flaɪ/', meaning: 'An insect with colorful wings'},
                {word: 'Bread', pronunciation: '/bred/', meaning: 'Food made of flour, water, and yeast'},
                {word: 'Brother', pronunciation: '/ˈbrʌð.ər/', meaning: "A male sibling"},
                {word: 'Bear', pronunciation: '/ber/', meaning: 'A large, heavy animal with thick fur'}
            ],
            'C': [
                {word: 'Cat', pronunciation: '/kæt/', meaning: 'A small furry animal kept as a pet'},
                {word: 'Car', pronunciation: '/kɑːr/', meaning: 'A vehicle with four wheels that people drive'},
                {word: 'Cake', pronunciation: '/keɪk/', meaning: 'A sweet baked food made from flour and sugar'},
                {word: 'Clock', pronunciation: '/klɒk/', meaning: 'A device that shows the time'},
                {word: 'Cloud', pronunciation: '/klaʊd/', meaning: 'White or gray mass in the sky'},
                {word: 'Computer', pronunciation: '/kəmˈpjuː.tər/', meaning: 'An electronic device for processing information'},
                {word: 'Cow', pronunciation: '/kaʊ/', meaning: 'A farm animal that gives milk'},
                {word: 'Crayon', pronunciation: '/ˈkreɪ.ɒn/', meaning: 'A colored stick used for drawing'}
            ]
        };
        
        // If we have sample words for this letter, use them
        if (sampleWords[letter]) {
            return sampleWords[letter];
        }
        
        // Otherwise generate some placeholder words
        for (let i = 1; i <= 9; i++) {
            wordsList.push({
                word: `${letter}${letter.toLowerCase()}${letter.toLowerCase()}${i}`,
                pronunciation: `/example/`,
                meaning: `Sample word ${i} starting with ${letter}`
            });
        }
        
        return wordsList;
    }

    // Record a word as learned and award points
    function learnWord(word) {
        appState.wordsLearned++;
        
        // Award a point for every 5 words learned
        if (appState.wordsLearned % 5 === 0) {
            awardPoints(1, 'wordPoints');
            showNotification(`You earned 1 point for learning ${word}!`);
        }
        
        // Check for achievements
        if (appState.wordsLearned === 10) {
            addAchievement('Word Explorer', 'Learned 10 words');
        } else if (appState.wordsLearned === 50) {
            addAchievement('Vocabulary Builder', 'Learned 50 words');
        } else if (appState.wordsLearned === 100) {
            addAchievement('Word Master', 'Learned 100 words');
        }
        
        updatePointsDisplay();
        saveAppState();
    }

    // Load Numbers Range
    function loadNumbersRange(range) {
        const numbersContainer = document.getElementById('numbersList');
        numbersContainer.innerHTML = '';
        
        let start, end;
        [start, end] = range.split('-').map(num => parseInt(num));
        
        for (let i = start; i <= end; i++) {
            const numberCard = document.createElement('div');
            numberCard.className = 'number-card';
            
            const numberValue = document.createElement('h3');
            numberValue.textContent = i;
            
            const numberSpelling = document.createElement('p');
            numberSpelling.textContent = getNumberSpelling(i);
            
            numberCard.appendChild(numberValue);
            numberCard.appendChild(numberSpelling);
            
            numbersContainer.appendChild(numberCard);
        }
    }

    // Get spelling for a number
    function getNumberSpelling(num) {
        const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        
        if (num < 20) {
            return units[num];
        } else if (num < 100) {
            return tens[Math.floor(num / 10)] + (num % 10 ? '-' + units[num % 10] : '');
        } else {
            return 'one hundred';
        }
    }

    // Generate number quiz
    function generateNumberQuiz() {
        const quizNumber = Math.floor(Math.random() * 100) + 1;
        document.getElementById('quizNumber').textContent = quizNumber;
        document.getElementById('numberSpellingInput').value = '';
        document.getElementById('numberQuizResult').textContent = '';
    }

    // Check number spelling
    function checkNumberSpelling() {
        const quizNumber = parseInt(document.getElementById('quizNumber').textContent);
        const userAnswer = document.getElementById('numberSpellingInput').value.trim().toLowerCase();
        const correctAnswer = getNumberSpelling(quizNumber).toLowerCase();
        const resultElement = document.getElementById('numberQuizResult');
        
        if (userAnswer === correctAnswer) {
            resultElement.textContent = '✅ Correct! Well done!';
            resultElement.style.color = 'var(--secondary-color)';
            
            // Award points
            awardPoints(1, 'exercisePoints');
            appState.quizzesCompleted++;
            
            // Generate new quiz after a correct answer
            setTimeout(generateNumberQuiz, 1500);
        } else {
            resultElement.textContent = `❌ Not quite. Try again! Hint: It starts with "${correctAnswer.charAt(0)}"`;
            resultElement.style.color = 'var(--tertiary-color)';
        }
        
        saveAppState();
    }

    // Load Grammar Topic
    function loadGrammarTopic(topic) {
        const contentElement = document.getElementById('grammarTopicContent');
        
        // Grammar topics content
        const grammarTopics = {
            'nouns': {
                title: 'Nouns',
                description: 'A noun is a word that names a person, place, thing, or idea.',
                examples: [
                    { word: 'Girl', sentence: 'The girl is playing in the park.' },
                    { word: 'School', sentence: 'I go to school every day.' },
                    { word: 'Ball', sentence: 'He kicked the ball into the goal.' },
                    { word: 'Happiness', sentence: 'Happiness is important for everyone.' }
                ]
            },
            'pronouns': {
                title: 'Pronouns',
                description: 'A pronoun is a word that takes the place of a noun.',
                examples: [
                    { word: 'He', sentence: 'He is a good boy.' },
                    { word: 'She', sentence: 'She loves to read books.' },
                    { word: 'It', sentence: 'It is a beautiful day.' },
                    { word: 'They', sentence: 'They are playing together.' }
                ]
            },
            'verbs': {
                title: 'Verbs',
                description: 'A verb is a word that shows action or state of being.',
                examples: [
                    { word: 'Run', sentence: 'The children run in the playground.' },
                    { word: 'Eat', sentence: 'I eat breakfast every morning.' },
                    { word: 'Sleep', sentence: 'Babies sleep a lot.' },
                    { word: 'Is', sentence: 'She is my friend.' }
                ]
            },
            'adjectives': {
                title: 'Adjectives',
                description: 'An adjective is a word that describes a noun or pronoun.',
                examples: [
                    { word: 'Happy', sentence: 'The happy child smiled.' },
                    { word: 'Big', sentence: 'I saw a big elephant at the zoo.' },
                    { word: 'Red', sentence: 'She wore a red dress to the party.' },
                    { word: 'Five', sentence: 'I have five fingers on each hand.' }
                ]
            },
            'adverbs': {
                title: 'Adverbs',
                description: 'An adverb is a word that describes a verb, adjective, or another adverb.',
                examples: [
                    { word: 'Quickly', sentence: 'He ran quickly to catch the bus.' },
                    { word: 'Very', sentence: 'The cake is very delicious.' },
                    { word: 'Well', sentence: 'She sings very well.' },
                    { word: 'Always', sentence: 'I always brush my teeth before bed.' }
                ]
            },
            'prepositions': {
                title: 'Prepositions',
                description: 'A preposition is a word that shows the relationship between a noun or pronoun and other words in a sentence.',
                examples: [
                    { word: 'In', sentence: 'The cat is in the box.' },
                    { word: 'On', sentence: 'The book is on the table.' },
                    { word: 'Under', sentence: 'The dog is hiding under the bed.' },
                    { word: 'Between', sentence: 'The ball is between the two chairs.' }
                ]
            },
            'conjunctions': {
                title: 'Conjunctions',
                description: 'A conjunction is a word that joins words, phrases, or clauses.',
                examples: [
                    { word: 'And', sentence: 'I like apples and oranges.' },
                    { word: 'But', sentence: 'I want to go but I am too tired.' },
                    { word: 'Or', sentence: 'You can have cake or ice cream.' },
                    { word: 'Because', sentence: 'I am happy because I got a new toy.' }
                ]
            }
        };
        
        // Create content for the selected topic
        if (grammarTopics[topic]) {
            const topicData = grammarTopics[topic];
            
            contentElement.innerHTML = `
                <div class="grammar-topic">
                    <h3>${topicData.title}</h3>
                    <p>${topicData.description}</p>
                    
                    <div class="example-box">
                        <h4>Examples:</h4>
                        <ul>
                            ${topicData.examples.map(example => `
                                <li><strong>${example.word}</strong>: ${example.sentence}</li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `;
        } else {
            contentElement.innerHTML = `
                <div class="grammar-placeholder">
                    <p>Topic content not available. Please select another topic.</p>
                </div>
            `;
        }
    }

    // Check Fill in Blank Answer
    function checkFillBlankAnswer() {
        const selectedOption = document.querySelector('.option-btn.selected');
        const resultElement = document.getElementById('fillBlankResult');
        
        if (!selectedOption) {
            resultElement.textContent = 'Please select an answer first!';
            resultElement.style.color = 'var(--tertiary-color)';
            return;
        }
        
        // In this example, "on" is the correct answer
        if (selectedOption.textContent === 'on') {
            resultElement.textContent = '✅ Correct! The cat is sleeping on the bed.';
            resultElement.style.color = 'var(--secondary-color)';
            
            // Award points
            awardPoints(1, 'exercisePoints');
            appState.exercisesCompleted++;
        } else {
            resultElement.textContent = '❌ Not quite right. Try again!';
            resultElement.style.color = 'var(--tertiary-color)';
        }
        
        saveAppState();
    }

    // Check Reading Answers
    function checkReadingAnswers() {
        const answers = document.querySelectorAll('.reading-answer');
        const resultElement = document.getElementById('readingResult');
        
        const correctAnswers = ['sun', 'park'];
        let correct = 0;
        
        answers.forEach((answer, index) => {
            if (answer.value.trim().toLowerCase() === correctAnswers[index]) {
                correct++;
            }
        });
        
        if (correct === correctAnswers.length) {
            resultElement.textContent = '✅ Perfect! All answers are correct!';
            resultElement.style.color = 'var(--secondary-color)';
            
            // Award points
            awardPoints(2, 'exercisePoints');
            appState.exercisesCompleted++;
        } else {
            resultElement.textContent = `You got ${correct} out of ${correctAnswers.length} correct. Try again!`;
            resultElement.style.color = 'var(--tertiary-color)';
        }
        
        saveAppState();
    }

    // Save Writing Task
    function saveWritingTask() {
        const writingText = document.getElementById('writingTextarea').value.trim();
        const resultElement = document.getElementById('writingSaved');
        
        if (writingText.length < 10) {
            resultElement.textContent = 'Please write at least a few sentences!';
            resultElement.style.color = 'var(--tertiary-color)';
            return;
        }
        
        resultElement.textContent = 'Your writing has been saved! Great job!';
        resultElement.style.color = 'var(--secondary-color)';
        
        // Award points for writing practice
        awardPoints(2, 'exercisePoints');
        appState.exercisesCompleted++;
        
        // Save to localStorage if needed
        localStorage.setItem('savedWriting', writingText);
        
        saveAppState();
    }

    // Load Story Category
    function loadStoryCategory(category) {
        const storiesContainer = document.getElementById('storiesList');
        storiesContainer.innerHTML = '';
        storiesContainer.style.display = 'grid';
        document.getElementById('storyReader').classList.remove('active');
        
        // Story categories content
        const storyCategories = {
            'interesting': [
                { title: 'The Friendly Giant', summary: 'A story about a kind giant who helps a village.', readTime: '3 min', content: 'Once upon a time, there was a giant who lived near a small village. Everyone was afraid of him because of his size, but the giant was actually very kind. One day, a terrible storm threatened to flood the village. The giant used his huge hands to build a wall of rocks that saved the village from flooding. The villagers realized the giant was friendly, and they became good friends with him. They invited him to all their celebrations, and the giant was no longer lonely.' },
                { title: 'The Clever Mouse', summary: 'A mouse uses its cleverness to escape a cat.', readTime: '2 min', content: 'There was a small mouse who lived in a hole in the wall. A cat always waited outside, hoping to catch the mouse. One day, the mouse had an idea. It took a small bell and tied it to a string. When the cat was sleeping, the mouse carefully placed the bell around the cat\'s neck. From that day on, whenever the cat moved, the bell would ring, and the mouse would know to hide. The clever mouse was never caught by the cat again.' },
                { title: 'The Magic Paintbrush', summary: 'A child finds a paintbrush that makes drawings come to life.', readTime: '4 min', content: 'A poor child named Li found an old paintbrush in the forest. When Li painted a bird with it, the bird suddenly came to life and flew away! Li discovered the paintbrush was magic. Li used the paintbrush to help the village. When there was a drought, Li painted rain clouds that turned into real rain. When people were hungry, Li painted fruits and vegetables that became real food. The villagers were grateful, and Li used the magic paintbrush wisely to help others.' }
            ],
            'mahabharata': [
                { title: 'The Birth of the Pandavas', summary: 'The story of how the five Pandava brothers were born.', readTime: '5 min', content: 'King Pandu and his wives Kunti and Madri were blessed with five sons. Kunti called upon different gods with a special mantra she had learned. Yudhishthira was born from the god Dharma and was known for his righteousness. Bhima was born from the god Vayu (Wind) and had enormous strength. Arjuna was born from Indra, the king of gods, and became a master archer. The twins Nakula and Sahadeva were born to Madri from the Ashvini twins, the divine physicians. These five brothers were known as the Pandavas.' },
                { title: 'Arjuna and the Eye of the Bird', summary: 'How Arjuna learned focus from his teacher Dronacharya.', readTime: '3 min', content: 'Dronacharya, the royal teacher, decided to test his students\' archery skills. He placed a wooden bird on a tree branch and called his students one by one. Before letting them shoot, he asked what they could see. Most students said they could see the bird, the tree, and other things around. When Arjuna\'s turn came, he said he could only see the eye of the bird, nothing else. Drona was impressed with Arjuna\'s focus and declared him the best archer. This taught everyone the importance of concentration.' }
            ],
            'ramayana': [
                { title: 'The Golden Deer', summary: 'How Ravana tricked Sita with a magical deer.', readTime: '4 min', content: 'During their time in the forest, Sita saw a beautiful golden deer and asked Rama to catch it for her. Rama, suspecting it might be a trick, still went after it to please Sita, leaving her with his brother Lakshmana. The deer was actually the demon Maricha in disguise. When Rama shot an arrow at the deer, Maricha screamed for help in Rama\'s voice. Hearing this, Sita urged Lakshmana to help Rama. Though reluctant, Lakshmana eventually went to look for Rama, leaving Sita alone. This gave Ravana the opportunity to kidnap Sita.' },
                { title: 'The Bridge to Lanka', summary: 'How Rama and his army built a bridge to cross the ocean.', readTime: '3 min', content: 'Rama and his army of monkeys needed to cross the ocean to reach Lanka, where Ravana had taken Sita. Rama prayed to the Ocean God for three days, asking for a way to cross. When the Ocean God appeared, he suggested that Rama build a bridge. Under the guidance of the architect Nala, the monkey army brought rocks and mountains and threw them into the ocean. Remarkably, the rocks floated instead of sinking. With everyone working together, they built a bridge across the ocean in just five days, allowing Rama\'s army to march to Lanka.' }
            ],
            'bible': [
                { title: 'David and Goliath', summary: 'The story of how young David defeated the giant Goliath.', readTime: '4 min', content: 'The Philistine army had a giant warrior named Goliath who was over nine feet tall. Goliath challenged the Israelites to send a warrior to fight him. Everyone was afraid except a young shepherd boy named David. King Saul offered David his armor, but it was too big and heavy. Instead, David took his sling and five smooth stones from a stream. When Goliath mocked the boy, David said he came in the name of the Lord. With one stone from his sling, David hit Goliath in the forehead, and the giant fell. This showed that with faith, even the smallest person can overcome great challenges.' },
                { title: 'Noah\'s Ark', summary: 'How Noah saved the animals from a great flood.', readTime: '5 min', content: 'God saw that the world had become filled with wickedness and decided to send a great flood. But Noah was a good man, so God told him to build a large ark (boat) and bring his family and two of every kind of animal inside. Noah worked for many years to build the ark. When it was finished, the animals came two by two, and Noah\'s family entered the ark. It rained for forty days and forty nights, and water covered even the highest mountains. When the rain stopped, Noah sent out a dove, which eventually returned with an olive leaf, showing that the water was receding. This story teaches about obedience and God\'s promise never to flood the entire Earth again.' }
            ],
            'quran': [
                { title: 'The Story of Yunus', summary: 'How Prophet Yunus was swallowed by a large fish.', readTime: '3 min', content: 'Prophet Yunus (Jonah) was sent to guide the people of Nineveh, but they rejected his message. Frustrated, Yunus left the city without waiting for Allah\'s command. He boarded a ship, but a storm arose, threatening to sink it. The passengers drew lots to decide who should be thrown overboard to lighten the ship, and Yunus was chosen. In the sea, a large fish swallowed him. Inside the fish, Yunus prayed to Allah, admitting his mistake. Allah accepted his prayer and commanded the fish to release him safely on shore. Yunus returned to Nineveh, where the people finally accepted his message. This story teaches us about patience, repentance, and Allah\'s mercy.' },
                { title: 'The Sleepers of the Cave', summary: 'The miraculous story of youths who slept for centuries.', readTime: '5 min', content: 'During a time when believers were persecuted, a group of young men took refuge in a cave. They prayed to Allah for protection, and Allah caused them to fall into a deep sleep. Their dog lay at the entrance of the cave, guarding them. Allah caused the sun to avoid their cave, and He turned them from side to side to protect their bodies. They slept for 309 years. When they woke up, they thought they had slept for just a day or part of a day. One went to the city to buy food but was shocked to find everything had changed. The people of the city were amazed to learn about these sleepers, recognizing it as a sign of resurrection and Allah\'s power.' }
            ]
        };
        
        // Create story cards for the selected category
        if (storyCategories[category]) {
            storyCategories[category].forEach((story, index) => {
                const storyCard = document.createElement('div');
                storyCard.className = 'story-card';
                
                storyCard.innerHTML = `
                    <h3>${story.title}</h3>
                    <p>${story.summary}</p>
                    <p class="read-time">Reading time: ${story.readTime}</p>
                `;
                
                storyCard.addEventListener('click', () => {
                    readStory(story, category, index);
                });
                
                storiesContainer.appendChild(storyCard);
            });
        } else {
            storiesContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 20px;">
                    <p>No stories available for this category yet. Check back later!</p>
                </div>
            `;
        }
    }

    // Read a story
    function readStory(story, category, index) {
        const storiesList = document.getElementById('storiesList');
        const storyReader = document.getElementById('storyReader');
        const storyTitle = document.getElementById('storyTitle');
        const storyContent = document.getElementById('storyContent');
        
        storiesList.style.display = 'none';
        storyReader.classList.add('active');
        
        storyTitle.textContent = story.title;
        
        // Format the content with paragraphs
        const paragraphs = story.content.split('. ');
        let formattedContent = '';
        
        for (let i = 0; i < paragraphs.length; i += 2) {
            const paragraph = paragraphs.slice(i, i + 2).join('. ');
            formattedContent += `<p>${paragraph}${paragraph.endsWith('.') ? '' : '.'}</p>`;
        }
        
        storyContent.innerHTML = formattedContent;
        
        // Record story as read and award points
        appState.storiesRead++;
        
        // Award a point for every 2 stories read
        if (appState.storiesRead % 2 === 0) {
            awardPoints(1, 'storyPoints');
            showNotification(`You earned 1 point for reading "${story.title}"!`);
        }
        
        // Check for achievements
        if (appState.storiesRead === 5) {
            addAchievement('Story Starter', 'Read 5 stories');
        } else if (appState.storiesRead === 25) {
            addAchievement('Bookworm', 'Read 25 stories');
        } else if (appState.storiesRead === 50) {
            addAchievement('Literary Explorer', 'Read 50 stories');
        }
        
        updatePointsDisplay();
        saveAppState();
    }

    // Load Math Topic
    function loadMathTopic(topic) {
        const mathContent = document.getElementById('mathContent');
        
        // Math topics content
        const mathTopics = {
            'addition': {
                title: 'Addition',
                description: 'Addition is putting numbers together to find the total.',
                example: '5 + 3 = 8',
                explanation: 'When we add 5 apples and 3 apples, we get 8 apples in total.',
                problems: [
                    { question: 'What is 7 + 5?', answer: 12 },
                    { question: 'What is 4 + 9?', answer: 13 },
                    { question: 'What is 12 + 8?', answer: 20 }
                ]
            },
            'subtraction': {
                title: 'Subtraction',
                description: 'Subtraction is taking one number away from another.',
                example: '10 - 4 = 6',
                explanation: 'When we have 10 candies and eat 4, we have 6 candies left.',
                problems: [
                    { question: 'What is 15 - 7?', answer: 8 },
                    { question: 'What is 20 - 8?', answer: 12 },
                    { question: 'What is 13 - 6?', answer: 7 }
                ]
            },
            'multiplication': {
                title: 'Multiplication',
                description: 'Multiplication is adding a number to itself multiple times.',
                example: '3 × 4 = 12',
                explanation: 'This means 3 groups of 4, which is 4 + 4 + 4 = 12.',
                problems: [
                    { question: 'What is 5 × 3?', answer: 15 },
                    { question: 'What is 7 × 2?', answer: 14 },
                    { question: 'What is 4 × 6?', answer: 24 }
                ]
            },
            'division': {
                title: 'Division',
                description: 'Division is sharing or grouping numbers equally.',
                example: '12 ÷ 3 = 4',
                explanation: 'If we share 12 cookies equally among 3 friends, each friend gets 4 cookies.',
                problems: [
                    { question: 'What is 15 ÷ 3?', answer: 5 },
                    { question: 'What is 20 ÷ 4?', answer: 5 },
                    { question: 'What is 18 ÷ 6?', answer: 3 }
                ]
            },
            'fractions': {
                title: 'Fractions',
                description: 'Fractions represent parts of a whole.',
                example: '1/4 of a pizza',
                explanation: 'If a pizza is cut into 4 equal slices, each slice is 1/4 of the whole pizza.',
                problems: [
                    { question: 'What is half of 10?', answer: 5 },
                    { question: 'If you have 3/4 of a cake and eat 1/4, how much is left?', answer: '1/2' },
                    { question: 'What is 2/3 of 9?', answer: 6 }
                ]
            },
            'physics': {
                title: 'Basic Physics',
                description: 'Physics is the study of matter, energy, and how things move.',
                example: 'Gravity pulls objects toward Earth',
                explanation: 'When you drop a ball, it falls to the ground because of gravity.',
                problems: [
                    { question: 'What force pulls objects toward Earth?', answer: 'gravity' },
                    { question: 'If you push a ball, what makes it eventually stop rolling?', answer: 'friction' },
                    { question: 'Does light travel faster than sound?', answer: 'yes' }
                ]
            }
        };
        
        // Create content for the selected topic
        if (mathTopics[topic]) {
            const topicData = mathTopics[topic];
            
            mathContent.innerHTML = `
                <div class="math-topic-intro">
                    <h3>${topicData.title}</h3>
                    <p>${topicData.description}</p>
                    <div class="math-example">
                        <p>Example: ${topicData.example}</p>
                        <p>${topicData.explanation}</p>
                    </div>
                </div>
                
                <div class="math-practice">
                    <h4>Practice Questions</h4>
                    ${topicData.problems.map((problem, index) => `
                        <div class="practice-question" data-index="${index}">
                            <p>${problem.question}</p>
                            <input type="text" class="math-answer" data-answer="${problem.answer}">
                            <button class="check-math-btn">Check</button>
                            <span class="math-result"></span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // Add event listeners to check buttons
            document.querySelectorAll('.check-math-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const questionDiv = this.parentElement;
                    const input = questionDiv.querySelector('.math-answer');
                    const result = questionDiv.querySelector('.math-result');
                    const correctAnswer = input.getAttribute('data-answer');
                    const userAnswer = input.value.trim().toLowerCase();
                    
                    if (userAnswer === correctAnswer.toString().toLowerCase()) {
                        result.textContent = '✓ Correct!';
                        result.style.color = 'var(--secondary-color)';
                        
                        // Award points for every 3 correct answers
                        appState.exercisesCompleted++;
                        if (appState.exercisesCompleted % 3 === 0) {
                            awardPoints(1, 'exercisePoints');
                            showNotification('You earned 1 point for math practice!');
                        }
                        
                        updatePointsDisplay();
                        saveAppState();
                    } else {
                        result.textContent = '✗ Try again';
                        result.style.color = 'var(--tertiary-color)';
                    }
                });
            });
        } else {
            mathContent.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <p>Topic content not available. Please select another topic.</p>
                </div>
            `;
        }
    }

    // Setup Math Practice
    function setupMathPractice() {
        // This is handled in the loadMathTopic function
    }

    // Initialize Course Calendar
    function initializeCourseCalendar() {
        const calendarContainer = document.querySelector('.course-calendar');
        calendarContainer.innerHTML = '';
        
        for (let day = 1; day <= 30; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (appState.completedDays.includes(day)) {
                dayElement.classList.add('completed');
            }
            
            if (day === appState.currentDay) {
                dayElement.classList.add('active');
            }
            
            dayElement.textContent = day;
            
            dayElement.addEventListener('click', () => {
                loadDayLesson(day);
                
                // Update active class
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
                dayElement.classList.add('active');
            });
            
            calendarContainer.appendChild(dayElement);
        }
        
        // Load current day lesson by default
        loadDayLesson(appState.currentDay);
        
        // Update progress bar
        document.getElementById('courseProgress').style.width = (appState.completedDays.length / 30 * 100) + '%';
        document.getElementById('currentDay').textContent = appState.currentDay;
    }

    // Load Day Lesson
    function loadDayLesson(day) {
        const lessonContent = document.querySelector('.lesson-content');
        const lessonDay = document.getElementById('lessonDay');
        
        lessonDay.textContent = day;
        
        // Sample 30-day course content
        const dailyLessons = {
            1: {
                title: 'Getting Started with Letters',
                content: '<p>Today, we\'ll learn the first 5 letters of the alphabet: A, B, C, D, and E.</p>' +
                         '<p>For each letter, we\'ll learn the sound and a word that starts with it.</p>' +
                         '<ul>' +
                         '<li>A - Apple: A round fruit that is often red, green, or yellow.</li>' +
                         '<li>B - Ball: A round object that bounces and is used in many games.</li>' +
                         '<li>C - Cat: A small furry animal that people keep as a pet.</li>' +
                         '<li>D - Dog: A common pet animal that barks.</li>' +
                         '<li>E - Elephant: A large gray animal with a long trunk.</li>' +
                         '</ul>' +
                         '<p>Practice writing these letters and saying their sounds!</p>'
            },
            2: {
                title: 'Counting from 1 to 5',
                content: '<p>Today, we\'ll learn to count from 1 to 5 and write these numbers.</p>' +
                         '<ul>' +
                         '<li>1 - One: Draw a straight line down.</li>' +
                         '<li>2 - Two: Make a curve and then a line across the bottom.</li>' +
                         '<li>3 - Three: Make two curves, one on top of the other.</li>' +
                         '<li>4 - Four: Draw a line down, a line across, and another line down.</li>' +
                         '<li>5 - Five: Draw a line down, a curve at the top, and a curve at the bottom.</li>' +
                         '</ul>' +
                         '<p>Count objects around you using these numbers!</p>'
            },
            3: {
                title: 'Simple Words: "The" and "A"',
                content: '<p>Today, we\'ll learn two small but important words: "The" and "A".</p>' +
                         '<p>"The" is used when we talk about a specific thing:</p>' +
                         '<ul>' +
                         '<li>The ball is red. (We are talking about a specific ball)</li>' +
                         '<li>The cat is sleeping. (We are talking about a specific cat)</li>' +
                         '</ul>' +
                         '<p>"A" is used when we talk about one thing that could be any one:</p>' +
                         '<ul>' +
                         '<li>I see a bird. (It could be any bird)</li>' +
                         '<li>I have a toy. (It could be any toy)</li>' +
                         '</ul>' +
                         '<p>Practice using "The" and "A" in sentences!</p>'
            }
            // Additional days would be defined here
        };
        
        // For days not specifically defined, generate placeholder content
        if (!dailyLessons[day]) {
            lessonContent.innerHTML = `
                <h4>Day ${day} Lesson</h4>
                <p>Today's lesson focuses on continuing your learning journey.</p>
                <p>Activities for today:</p>
                <ul>
                    <li>Review previous lessons</li>
                    <li>Learn new words starting with letter ${String.fromCharCode(64 + (day % 26 || 26))}</li>
                    <li>Practice counting and writing numbers</li>
                    <li>Read a short story</li>
                </ul>
                <p>Keep up the good work! Remember to practice what you've learned.</p>
            `;
        } else {
            lessonContent.innerHTML = `
                <h4>${dailyLessons[day].title}</h4>
                ${dailyLessons[day].content}
            `;
        }
        
        // Update complete button state
        const completeButton = document.getElementById('completeLesson');
        if (appState.completedDays.includes(day)) {
            completeButton.textContent = 'Already Completed';
            completeButton.disabled = true;
        } else {
            completeButton.textContent = 'Mark as Complete';
            completeButton.disabled = false;
        }
    }

    // Complete Current Lesson
    function completeCurrentLesson() {
        const currentDay = parseInt(document.getElementById('lessonDay').textContent);
        
        if (!appState.completedDays.includes(currentDay)) {
            appState.completedDays.push(currentDay);
            
            // Award points
            awardPoints(2, 'learningPoints');
            showNotification(`You completed Day ${currentDay}! +2 points!`);
            
            // Update calendar
            initializeCourseCalendar();
            
            // Update app state
            if (currentDay === appState.currentDay) {
                appState.currentDay = Math.min(30, currentDay + 1);
            }
            
            // Check for achievements
            if (appState.completedDays.length === 7) {
                addAchievement('Week Champion', 'Completed 7 days of lessons');
            } else if (appState.completedDays.length === 14) {
                addAchievement('Learning Streak', 'Completed 14 days of lessons');
            } else if (appState.completedDays.length === 30) {
                addAchievement('Course Graduate', 'Completed all 30 days of lessons');
            }
            
            saveAppState();
        }
    }

    // Update Profile Display
    function updateProfileDisplay() {
        document.getElementById('userName').textContent = appState.username;
        document.getElementById('profilePoints').textContent = appState.points;
        document.getElementById('daysActive').textContent = appState.daysActive;
        document.getElementById('wordsLearned').textContent = appState.wordsLearned;
        document.getElementById('storiesRead').textContent = appState.storiesRead;
        document.getElementById('quizzesCompleted').textContent = appState.quizzesCompleted;
        document.getElementById('exercisesDone').textContent = appState.exercisesCompleted;
        
        // Populate achievements
        const achievementsList = document.getElementById('achievementsList');
        
        if (appState.achievements.length === 0) {
            achievementsList.innerHTML = `
                <div class="achievement-placeholder">
                    <p>Start learning to earn achievements!</p>
                </div>
            `;
        } else {
            achievementsList.innerHTML = '';
            
            appState.achievements.forEach(achievement => {
                const achievementCard = document.createElement('div');
                achievementCard.className = 'achievement-card';
                
                achievementCard.innerHTML = `
                    <div class="achievement-icon">
                        <i class="fas fa-award"></i>
                    </div>
                    <h4>${achievement.title}</h4>
                    <p>${achievement.description}</p>
                `;
                
                achievementsList.appendChild(achievementCard);
            });
        }
    }

    // Reset Progress
    function confirmResetProgress() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            resetAppState();
            showNotification('Progress has been reset');
            updateProfileDisplay();
            navigateToSection('home');
        }
    }

    // Change Username
    function promptChangeUsername() {
        const newUsername = prompt('Enter your new username:', appState.username);
        
        if (newUsername && newUsername.trim() !== '') {
            appState.username = newUsername.trim();
            saveAppState();
            updateProfileDisplay();
            showNotification('Username updated!');
        }
    }

    // Points Modal Functions
    function showPointsModal() {
        const pointsModal = document.getElementById('pointsModal');
        pointsModal.classList.add('active');
        
        // Update points information
        document.getElementById('modalTotalPoints').textContent = appState.points;
        document.getElementById('pointsProgressFill').style.width = `${appState.points}%`;
        
        document.getElementById('wordPoints').textContent = appState.wordPoints;
        document.getElementById('exercisePoints').textContent = appState.exercisePoints;
        document.getElementById('storyPoints').textContent = appState.storyPoints;
        document.getElementById('learningPoints').textContent = appState.learningPoints;
    }

    function hidePointsModal() {
        const pointsModal = document.getElementById('pointsModal');
        pointsModal.classList.remove('active');
    }

    // Helper Functions
    function awardPoints(amount, category) {
        // Ensure points don't exceed 100
        const newPoints = Math.min(100, appState.points + amount);
        appState[category] = appState[category] + amount;
        
        // Check if we reached 100 points
        if (appState.points < 100 && newPoints === 100) {
            addAchievement('Point Master', 'Reached 100 points!');
            showNotification('🎉 Congratulations! You reached 100 points! 🎉');
        }
        
        appState.points = newPoints;
        updatePointsDisplay();
    }

    function updatePointsDisplay() {
        document.getElementById('pointsCount').textContent = appState.points;
    }

    function addAchievement(title, description) {
        // Check if achievement already exists
        const exists = appState.achievements.some(a => a.title === title);
        
        if (!exists) {
            appState.achievements.push({ title, description });
            showNotification(`New Achievement: ${title}!`);
        }
    }

    function showNotification(message) {
        // Simple notification system (can be enhanced)
        alert(message);
    }

    function updateMotivation() {
        const motivationText = document.getElementById('motivationText');
        const randomIndex = Math.floor(Math.random() * appState.motivationalPhrases.length);
        motivationText.textContent = appState.motivationalPhrases[randomIndex];
        
        // Change motivation message every 60 seconds
        setTimeout(updateMotivation, 60000);
    }

    // App State Management
    function saveAppState() {
        localStorage.setItem('kidsGramnerState', JSON.stringify(appState));
    }

    function loadAppState() {
        const savedState = localStorage.getItem('kidsGramnerState');
        
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            
            // Update appState with saved values
            Object.keys(parsedState).forEach(key => {
                appState[key] = parsedState[key];
            });
            
            // Check if this is a new day
            const lastDate = localStorage.getItem('lastActiveDate');
            const today = new Date().toDateString();
            
            if (lastDate !== today) {
                appState.daysActive++;
                localStorage.setItem('lastActiveDate', today);
            }
        } else {
            // First time user
            localStorage.setItem('lastActiveDate', new Date().toDateString());
            appState.daysActive = 1;
        }
    }

    function resetAppState() {
        appState.points = 0;
        appState.wordsLearned = 0;
        appState.storiesRead = 0;
        appState.exercisesCompleted = 0;
        appState.quizzesCompleted = 0;
        appState.wordPoints = 0;
        appState.exercisePoints = 0;
        appState.storyPoints = 0;
        appState.learningPoints = 0;
        appState.currentDay = 1;
        appState.completedDays = [];
        appState.achievements = [];
        
        saveAppState();
        
        // Reinitialize necessary components
        initializeCourseCalendar();
        updatePointsDisplay();
    }
});
