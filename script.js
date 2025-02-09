document.addEventListener('DOMContentLoaded', () => {
    // Track quiz start
    const startQuizButton = document.getElementById('startQuizButton');
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizContainer = document.getElementById('quiz-container');
    const resultsScreen = document.getElementById('results-screen');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const joinNowButton = document.getElementById('joinNowButton');
    const currentQuestionNumber = document.getElementById('currentQuestionNumber');
    const progressFill = document.getElementById('progressFill');

    let currentQuestion = 1;
    const totalQuestions = 4;
    const userAnswers = {};

    function updateProgress() {
        currentQuestionNumber.textContent = currentQuestion;
        progressFill.style.width = `${(currentQuestion / totalQuestions) * 100}%`;
    }

    // Start Quiz
    startQuizButton.addEventListener('click', () => {
        gtag('event', 'start_quiz', {
            'event_category': 'engagement',
            'event_label': 'quiz_start'
        });
        
        welcomeScreen.style.display = 'none';
        quizContainer.style.display = 'block';
        quizContainer.classList.add('fade-in');
        updateNavigationButtons();
        updateProgress();
    });

    // Navigation Buttons
    prevButton.addEventListener('click', () => {
        if (currentQuestion > 1) {
            document.getElementById(`q${currentQuestion}`).style.display = 'none';
            currentQuestion--;
            document.getElementById(`q${currentQuestion}`).style.display = 'block';
            document.getElementById(`q${currentQuestion}`).classList.add('slide-in');
            updateNavigationButtons();
            updateProgress();
        }
    });

    nextButton.addEventListener('click', () => {
        // Check if an option is selected
        const currentQuestionEl = document.getElementById(`q${currentQuestion}`);
        const selectedOption = currentQuestionEl.querySelector('.option-button.selected');
        
        if (!selectedOption && currentQuestion !== totalQuestions) {
            alert('من فضلك اختار إجابة');
            return;
        }

        if (currentQuestion < totalQuestions) {
            document.getElementById(`q${currentQuestion}`).style.display = 'none';
            currentQuestion++;
            document.getElementById(`q${currentQuestion}`).style.display = 'block';
            document.getElementById(`q${currentQuestion}`).classList.add('slide-in');
            updateNavigationButtons();
            updateProgress();

            // Track question progress
            gtag('event', 'question_answered', {
                'event_category': 'quiz_progress',
                'event_label': `question_${currentQuestion-1}`
            });
        } else {
            showResults();
        }
    });

    // Option Selection
    window.selectOption = function(button) {
        const questionDiv = button.closest('.question');
        questionDiv.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        button.classList.add('selected');
        userAnswers[currentQuestion] = button.textContent;
        
        gtag('event', 'answer_selected', {
            'event_category': 'quiz_interaction',
            'event_label': `q${currentQuestion}_${button.textContent}`
        });

        // Enable next button
        nextButton.disabled = false;
    };

    // Update Navigation Buttons
    function updateNavigationButtons() {
        prevButton.style.display = currentQuestion === 1 ? 'none' : 'block';
        nextButton.textContent = currentQuestion === totalQuestions ? 'اظهر النتيجة' : 'التالي';
        
        // Disable next button if no option is selected
        const currentQuestionEl = document.getElementById(`q${currentQuestion}`);
        const selectedOption = currentQuestionEl.querySelector('.option-button.selected');
        nextButton.disabled = !selectedOption && currentQuestion !== totalQuestions;
    }

    // Show Results
    function showResults() {
        quizContainer.style.display = 'none';
        resultsScreen.style.display = 'block';
        resultsScreen.classList.add('fade-in');
        
        // Track quiz completion
        gtag('event', 'quiz_completed', {
            'event_category': 'conversion',
            'event_label': 'quiz_completion'
        });
        
        let userType = determineUserType(userAnswers);
        
        const resultTitle = document.getElementById('resultTitle');
        const resultDescription = document.getElementById('resultDescription');
        const personalizedBenefits = document.getElementById('personalizedBenefits');
        
        resultTitle.textContent = userType.title;
        resultDescription.textContent = userType.description;
        
        personalizedBenefits.innerHTML = userType.benefits.map(benefit => `
            <div class="benefit-item">
                <span>${benefit.emoji}</span>
                <p>${benefit.text}</p>
            </div>
        `).join('');
    }

    function determineUserType(answers) {
        let score = {
            enthusiast: 0,
            expert: 0
        };

        // Question 1: Learning style
        if (answers[1]?.includes('بحب أتكلم') || answers[1]?.includes('المحادثة')) {
            score.enthusiast += 2;
        } else if (answers[1]?.includes('القواعد')) {
            score.expert += 2;
        }

        // Question 2: Time commitment
        if (answers[2]?.includes('4-5') || answers[2]?.includes('أكثر من 5')) {
            score.expert += 2;
        } else {
            score.enthusiast += 1;
        }

        // Question 3: Feedback style
        if (answers[3]?.includes('تقارير') || answers[3]?.includes('مناقشات')) {
            score.expert += 2;
        } else {
            score.enthusiast += 1;
        }

        const types = {
            enthusiast: {
                title: "مستكشف اللغات المتحمس! 🌟",
                description: "أنت شخص شغوف بتعلم اللغات ولديك الحماس والوقت للمساعدة في تطوير Maris AI. نحن متحمسون لمشاركتك معنا!",
                benefits: [
                    { emoji: "🎯", text: "أول من يجرب الميزات الجديدة" },
                    { emoji: "💎", text: "عضوية VIP مجانية لمدة عام" },
                    { emoji: "🤝", text: "تأثير مباشر على تطوير المنتج" },
                    { emoji: "🌍", text: "فرصة للتواصل مع متعلمي لغات من حول العالم" }
                ]
            },
            expert: {
                title: "خبير تطوير اللغات! 👨‍🏫",
                description: "خبرتك في تعلم اللغات والتزامك بالتطوير سيساعدنا في تحسين تجربة التعلم لجميع المستخدمين",
                benefits: [
                    { emoji: "👑", text: "صلاحيات خاصة في مجتمع المطورين" },
                    { emoji: "🎓", text: "شهادة رسمية كمستشار لغوي" },
                    { emoji: "💡", text: "المشاركة في جلسات عصف ذهني خاصة" },
                    { emoji: "🎁", text: "مكافآت حصرية للمساهمين" }
                ]
            }
        };

        return score.enthusiast >= score.expert ? types.enthusiast : types.expert;
    }

    // Join Now Button
    joinNowButton.addEventListener('click', () => {
        // Detect mobile device
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        // Track join attempt
        gtag('event', 'join_click', {
            'event_category': 'conversion',
            'event_label': isMobile ? (isIOS ? 'ios' : 'android') : 'desktop'
        });

        if (!isMobile) {
            alert('من فضلك استخدم الموبايل عشان تقدر تنضم معانا');
            return;
        }

        const iosGroupLink = 'https://t.me/+gRN1Vcmbr0tiZTU0';
        const androidGroupLink = 'https://t.me/+f1_PxBSvRMZiMzE0';
        
        window.location.href = isIOS ? iosGroupLink : androidGroupLink;
    });
}); 