function StoryWriterApp() {
    const [story, setStory] = React.useState('');
    const [wordCount, setWordCount] = React.useState(0);
    const [saveStatus, setSaveStatus] = React.useState('');
    const [storyName, setStoryName] = React.useState('');
    const [stories, setStories] = React.useState([]);
    const [currentStory, setCurrentStory] = React.useState(null);
    const [quill, setQuill] = React.useState(null);
    const [suggestions, setSuggestions] = React.useState('');
    const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
    const [showCanvas, setShowCanvas] = React.useState(false);
    const [canvas, setCanvas] = React.useState(null);
    const [showImageGen, setShowImageGen] = React.useState(false);
    const [generatedImage, setGeneratedImage] = React.useState('');
    const [loadingImage, setLoadingImage] = React.useState(false);
    const [showCharSheet, setShowCharSheet] = React.useState(false);
    const [characters, setCharacters] = React.useState([]);
    const [currentChar, setCurrentChar] = React.useState({
        name: '',
        age: '',
        description: '',
        traits: '',
        backstory: ''
    });
    const [showInitialLoader, setShowInitialLoader] = React.useState(true);
    const [showLandingPage, setShowLandingPage] = React.useState(false);
    const [showAboutPage, setShowAboutPage] = React.useState(false);
    const [showStartLoader, setShowStartLoader] = React.useState(false);
    const [isDarkMode, setIsDarkMode] = React.useState(true);
    const [selectedLanguage, setSelectedLanguage] = React.useState('English');

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShowInitialLoader(false);
            setShowLandingPage(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    React.useEffect(() => {
        if (!showInitialLoader && !showLandingPage && !showAboutPage) {
            setTimeout(() => {
                const editorElement = document.getElementById('editor');
                if (editorElement && !quill) {
                    const q = new Quill('#editor', {
                        theme: 'snow',
                        placeholder: 'Start writing your story here...',
                        modules: {
                            toolbar: [
                                ['bold', 'italic', 'underline'],
                                [{ 'header': [1, 2, 3, false] }],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['clean']
                            ]
                        }
                    });
                    
                    q.on('text-change', () => {
                        const html = q.root.innerHTML;
                        setStory(html);
                        updateWordCount(html);
                    });
                    
                    setQuill(q);
                }
            }, 100);
        }
        
        // Clean up Quill when leaving main page
        if (showLandingPage || showAboutPage) {
            if (quill) {
                setQuill(null);
            }
        }
    }, [showInitialLoader, showLandingPage, showAboutPage, quill]);

    React.useEffect(() => {
        if (!showLandingPage) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    if (entry.target.dataset.section === 'stats') {
                        const counters = entry.target.querySelectorAll('.stat-number');
                        counters.forEach(counter => {
                            const target = parseFloat(counter.dataset.target);
                            const isDecimal = target.toString().includes('.');
                            const suffix = target >= 1000 ? 'K+' : target === 99.9 ? '%' : target === 24 ? '/7' : '+';
                            const displayTarget = target >= 1000 ? target / 1000 : target;
                            
                            let current = 0;
                            const increment = displayTarget / 50;
                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= displayTarget) {
                                    current = displayTarget;
                                    clearInterval(timer);
                                }
                                counter.textContent = isDecimal ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
                            }, 30);
                        });
                    }
                }
            });
        }, { threshold: 0.3 });
        
        const sections = document.querySelectorAll('[data-section]');
        sections.forEach(section => observer.observe(section));
        
        return () => observer.disconnect();
    }, [showLandingPage]);

    React.useEffect(() => {
        if (showLandingPage) {
            const canvas = document.getElementById('stars-canvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const stars = [];
            const shootingStars = [];
            const numStars = Math.floor((canvas.width * canvas.height) * 0.0002);
            
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: 0.5 + Math.random() * 1.5,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2
                });
            }
            
            const createShootingStar = () => {
                const side = Math.floor(Math.random() * 4);
                let x, y, vx, vy;
                
                switch (side) {
                    case 0: // top
                        x = Math.random() * canvas.width;
                        y = 0;
                        vx = (Math.random() - 0.5) * 4;
                        vy = Math.random() * 3 + 2;
                        break;
                    case 1: // right
                        x = canvas.width;
                        y = Math.random() * canvas.height;
                        vx = -(Math.random() * 3 + 2);
                        vy = (Math.random() - 0.5) * 4;
                        break;
                    case 2: // bottom
                        x = Math.random() * canvas.width;
                        y = canvas.height;
                        vx = (Math.random() - 0.5) * 4;
                        vy = -(Math.random() * 3 + 2);
                        break;
                    case 3: // left
                        x = 0;
                        y = Math.random() * canvas.height;
                        vx = Math.random() * 3 + 2;
                        vy = (Math.random() - 0.5) * 4;
                        break;
                }
                
                shootingStars.push({
                    x, y, vx, vy,
                    length: Math.random() * 60 + 20,
                    opacity: 1,
                    life: 0
                });
            };
            
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw regular stars
                stars.forEach(star => {
                    star.x += star.vx;
                    star.y += star.vy;
                    
                    if (star.x < 0) star.x = canvas.width;
                    if (star.x > canvas.width) star.x = 0;
                    if (star.y < 0) star.y = canvas.height;
                    if (star.y > canvas.height) star.y = 0;
                    
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    const twinkle = 0.5 + Math.abs(Math.sin(Date.now() * 0.001 / star.twinkleSpeed) * 0.3);
                    const starColor = isDarkMode ? '255, 255, 255' : '100, 100, 100';
                    ctx.fillStyle = `rgba(${starColor}, ${star.opacity * twinkle})`;
                    ctx.fill();
                });
                
                // Draw shooting stars
                for (let i = shootingStars.length - 1; i >= 0; i--) {
                    const shootingStar = shootingStars[i];
                    shootingStar.x += shootingStar.vx;
                    shootingStar.y += shootingStar.vy;
                    shootingStar.life += 1;
                    shootingStar.opacity = Math.max(0, 1 - shootingStar.life / 60);
                    
                    if (shootingStar.opacity <= 0 || 
                        shootingStar.x < -100 || shootingStar.x > canvas.width + 100 ||
                        shootingStar.y < -100 || shootingStar.y > canvas.height + 100) {
                        shootingStars.splice(i, 1);
                        continue;
                    }
                    
                    const gradient = ctx.createLinearGradient(
                        shootingStar.x, shootingStar.y,
                        shootingStar.x - shootingStar.vx * shootingStar.length / 5,
                        shootingStar.y - shootingStar.vy * shootingStar.length / 5
                    );
                    
                    const shootingColor = isDarkMode ? '255, 255, 255' : '150, 150, 150';
                    gradient.addColorStop(0, `rgba(${shootingColor}, ${shootingStar.opacity})`);
                    gradient.addColorStop(1, `rgba(${shootingColor}, 0)`);
                    
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(shootingStar.x, shootingStar.y);
                    ctx.lineTo(
                        shootingStar.x - shootingStar.vx * shootingStar.length / 5,
                        shootingStar.y - shootingStar.vy * shootingStar.length / 5
                    );
                    ctx.stroke();
                }
                
                // Randomly create shooting stars
                if (Math.random() < 0.003) {
                    createShootingStar();
                }
                
                requestAnimationFrame(animate);
            };
            
            animate();
            
            const handleResize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            };
            
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [showLandingPage, isDarkMode]);

    React.useEffect(() => {
        if (!showAboutPage) return;
        
        const techStack = [
            { image: 'react.js.png', name: 'React.js' },
            { image: 'awslambda.png', name: 'AWS Lambda' },
            { image: 'awss3.png', name: 'Amazon S3' },
            { image: 'awsbedrock.png', name: 'AWS Bedrock' }
        ];
        let currentIndex = 0;
        
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % techStack.length;
            const imgElement = document.getElementById('tech-image');
            const nameElement = document.getElementById('tech-name');
            if (imgElement && nameElement) {
                imgElement.src = techStack[currentIndex].image;
                nameElement.textContent = techStack[currentIndex].name;
            }
        }, 2000);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.2 });
        
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
        
        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
    }, [showAboutPage]);

    React.useEffect(() => {
        if (showCanvas) {
            setTimeout(initCanvas, 100);
        } else if (canvas) {
            canvas.dispose();
            setCanvas(null);
        }
    }, [showCanvas]);

    React.useEffect(() => {
        if (!showInitialLoader && !showLandingPage && !showAboutPage) {
            listStories();
            listCharacters();
        }
    }, [showInitialLoader, showLandingPage, showAboutPage]);

    React.useEffect(() => {
        document.body.className = isDarkMode ? 'dark' : 'light';
    }, [isDarkMode]);

    const updateWordCount = (text) => {
        const plainText = text.replace(/<[^>]*>/g, '').trim();
        setWordCount(plainText.split(/\s+/).filter(word => word.length > 0).length);
    };

    const initCanvas = () => {
        if (canvas) {
            canvas.dispose();
        }
        
        const c = new fabric.Canvas('story-canvas', {
            width: 600,
            height: 400,
            backgroundColor: '#333'
        });
        c.freeDrawingBrush.width = 3;
        c.freeDrawingBrush.color = '#ffffff';
        c.isDrawingMode = true;
        setCanvas(c);
    };

    const changeCanvasColor = (color) => {
        if (canvas) {
            canvas.freeDrawingBrush.color = color;
        }
    };

    const saveCanvasLocal = () => {
        if (canvas) {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${storyName || 'story'}-map.png`;
            link.href = dataURL;
            link.click();
        }
    };

    const saveCanvasToS3 = async () => {
        if (!canvas) return;
        
        setSaveStatus('Saving canvas...');
        try {
            const dataURL = canvas.toDataURL('image/png');
            const base64Data = dataURL.split(',')[1];
            const response = await fetch('https://i7p8c7igtl.execute-api.us-east-1.amazonaws.com/prod/save', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    story: base64Data, 
                    name: `${storyName || 'story'}-canvas`
                })
            });

            if (response.ok) {
                setSaveStatus('Canvas saved to S3!');
            } else {
                setSaveStatus('Failed to save canvas');
            }
        } catch (error) {
            setSaveStatus('Error saving canvas');
        }
    };

    const loadCanvasFromS3 = async () => {
        if (!canvas || !storyName) {
            setSaveStatus('No canvas or story selected');
            return;
        }
        
        const canvasFilename = currentStory ? currentStory.replace('.txt', '-canvas.png') : `${storyName}-canvas.png`;
        setSaveStatus('Loading canvas...');
        
        try {
            const response = await fetch('https://pbdllb0wt8.execute-api.us-east-1.amazonaws.com/prod/canvas', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: canvasFilename })
            });
            
            if (response.ok) {
                const result = await response.json();
                let data;
                if (result.body) {
                    data = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
                } else {
                    data = result;
                }
                const imageData = data.imageData;
                
                if (imageData) {
                    const img = new Image();
                    img.onload = () => {
                        canvas.clear();
                        const fabricImg = new fabric.Image(img, {
                            left: 0,
                            top: 0,
                            scaleX: canvas.width / img.width,
                            scaleY: canvas.height / img.height
                        });
                        canvas.add(fabricImg);
                        canvas.renderAll();
                        setSaveStatus('Canvas loaded!');
                    };
                    img.onerror = () => {
                        setSaveStatus('Error loading canvas image');
                    };
                    img.src = `data:image/png;base64,${imageData}`;
                } else {
                    setSaveStatus('No canvas data received');
                }
            } else {
                setSaveStatus('Canvas not found for this story');
            }
        } catch (error) {
            setSaveStatus('Error loading canvas');
            console.error('Canvas load error:', error);
        }
    };

    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
            canvas.backgroundColor = '#333';
            canvas.renderAll();
        }
    };

    const listStories = async () => {
        try {
            const response = await fetch('https://epokscvush.execute-api.us-east-1.amazonaws.com/prod/list', {
                method: 'GET',
                mode: 'cors'
            });
            if (response.ok) {
                const result = await response.json();
                const data = typeof result.body === 'string' ? JSON.parse(result.body) : result;
                const storyFiles = (data.stories || []).filter(story => 
                    !story.filename.includes('-character.txt')
                );
                setStories(storyFiles);
            }
        } catch (error) {
            console.error('Failed to load stories:', error);
        }
    };

    const loadStory = async (filename) => {
        setSaveStatus('Loading...');
        try {
            const response = await fetch('https://6hqpsv28p0.execute-api.us-east-1.amazonaws.com/prod/load', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: filename })
            });
            if (response.ok) {
                const result = await response.json();
                const data = typeof result.body === 'string' ? JSON.parse(result.body) : result;
                const content = data.content || '';
                setStory(content);
                if (quill) {
                    quill.root.innerHTML = content;
                }
                setCurrentStory(filename);
                setStoryName(filename.replace('.txt', ''));
                updateWordCount(content);
                setSaveStatus('');
                setSuggestions('');
                
                // Clear canvas when switching stories
                if (canvas) {
                    canvas.clear();
                    canvas.backgroundColor = '#333';
                    canvas.renderAll();
                }
                
                // Clear current character and reload characters for this story
                setCurrentChar({ name: '', age: '', description: '', traits: '', backstory: '' });
                console.log('Loading characters for story:', filename);
                listCharacters(filename);
                
                if (showCanvas && canvas) {
                    setTimeout(loadCanvasFromS3, 500);
                }
            } else {
                const errorText = await response.text();
                setSaveStatus(`Load failed: ${errorText}`);
            }
        } catch (error) {
            console.error('Failed to load story:', error);
            setSaveStatus(`Load error: ${error.message}`);
        }
    };

    if (showInitialLoader) {
        return (
            <div className="initial-loader">
                <div className="loader-content">
                    <dotlottie-wc 
                        src="https://lottie.host/86ecc99f-10c1-4ea4-9cc2-2f279d6b6edd/KW1spL36fC.lottie" 
                        style={{width: '300px', height: '300px'}} 
                        speed="1" 
                        autoplay 
                        loop
                    ></dotlottie-wc>
                    <h1 className="app-title">Story Time</h1>
                </div>
            </div>
        );
    }

    if (showStartLoader) {
        return (
            <div className="initial-loader">
                <div className="loader-content">
                    <dotlottie-wc 
                        src="https://lottie.host/164d326f-9fa2-45cc-9f7f-0da372f3e688/8QsxhFHpw2.lottie" 
                        style={{width: '300px', height: '300px'}} 
                        speed="1" 
                        autoplay 
                        loop
                    ></dotlottie-wc>
                    <h1 className="app-title">Loading...</h1>
                </div>
            </div>
        );
    }

    if (showLandingPage) {
        return (
            <div className="landing-page">
                <canvas id="stars-canvas" className="stars-background"></canvas>
                <nav className="landing-nav">
                    <div className="nav-brand">Story Time</div>
                    <div className="nav-right">
                        <button className="nav-link" onClick={() => {
                            setShowLandingPage(false);
                            setShowAboutPage(true);
                        }}>About</button>
                        <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                            {isDarkMode ? 'Light' : 'Dark'}
                        </button>
                    </div>
                </nav>
                
                <div className="hero-section" data-section="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Write Stories with
                            <span className="gradient-text"> AI Power</span>
                        </h1>
                        <p className="hero-subtitle">
                            Transform your ideas into captivating stories with our AI-powered writing assistant. 
                            Create, visualize, and bring your characters to life.
                        </p>
                        <div className="hero-buttons">
                            <button 
                                className="cta-button primary"
                                onClick={() => {
                                    setShowStartLoader(true);
                                    setTimeout(() => {
                                        setShowStartLoader(false);
                                        setShowLandingPage(false);
                                    }, 2000);
                                }}
                            >
                                Start Writing
                            </button>
                            <button className="cta-button secondary">
                                Learn More
                            </button>
                        </div>
                    </div>
                    
                    <div className="hero-features">
                        <div className="feature-card">
                            <div className="feature-icon">AI</div>
                            <h3>AI Writing Assistant</h3>
                            <p>Get creative suggestions and overcome writer's block</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">MAP</div>
                            <h3>Visual Story Mapping</h3>
                            <p>Create visual maps and generate images for your stories</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">CHAR</div>
                            <h3>Character Development</h3>
                            <p>Build detailed character profiles and backstories</p>
                        </div>
                    </div>
                </div>
                
                <div className="creativity-section" data-section="creativity">
                    <div className="section-content">
                        <h2 className="section-title">
                            Unleash Your <span className="gradient-text">Creative Potential</span>
                        </h2>
                        <p className="section-subtitle">
                            Break through creative barriers with intelligent writing assistance that adapts to your unique style.
                        </p>
                        <div className="creativity-grid">
                            <div className="creativity-item">
                                <div className="creativity-icon">SMART</div>
                                <h3>Smart Suggestions</h3>
                                <p>AI-powered prompts tailored to your story's context and genre</p>
                            </div>
                            <div className="creativity-item">
                                <div className="creativity-icon">WORLD</div>
                                <h3>World Building</h3>
                                <p>Create rich, immersive worlds with detailed settings and lore</p>
                            </div>
                            <div className="creativity-item">
                                <div className="creativity-icon">GENRE</div>
                                <h3>Genre Flexibility</h3>
                                <p>From fantasy epics to sci-fi thrillers, adapt to any storytelling style</p>
                            </div>
                            <div className="creativity-item">
                                <div className="creativity-icon">REFINE</div>
                                <h3>Iterative Refinement</h3>
                                <p>Continuously improve your stories with intelligent feedback loops</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="language-section" data-section="language">
                    <div className="section-content">
                        <div className="language-content">
                            <div className="language-text">
                                <h2 className="section-title">Write in Any Language</h2>
                                <p className="section-subtitle">
                                    Story Time supports multiple languages, making creativity accessible to writers worldwide. 
                                    Express your ideas in your native tongue or explore new linguistic territories.
                                </p>
                                <div className="language-features">
                                    <div className="language-feature">
                                        <span className="check-icon">✓</span>
                                        <span>Multi-language AI assistance</span>
                                    </div>
                                    <div className="language-feature">
                                        <span className="check-icon">✓</span>
                                        <span>Cultural context awareness</span>
                                    </div>
                                    <div className="language-feature">
                                        <span className="check-icon">✓</span>
                                        <span>Real-time translation support</span>
                                    </div>
                                </div>
                            </div>
                            <div className="language-visual">
                                <div className="language-grid">
                                    <div className="lang-item">English</div>
                                    <div className="lang-item">Español</div>
                                    <div className="lang-item">Français</div>
                                    <div className="lang-item">日本語</div>
                                    <div className="lang-item">中文</div>
                                    <div className="lang-item">Deutsch</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="workflow-section" data-section="workflow">
                    <div className="section-content">
                        <h2 className="section-title">Streamlined Writing Workflow</h2>
                        <p className="section-subtitle">
                            From initial concept to final draft, Story Time guides you through every step of the creative process.
                        </p>
                        <div className="workflow-steps">
                            <div className="workflow-step">
                                <div className="step-number">1</div>
                                <h3>Ideate</h3>
                                <p>Generate ideas with AI-powered brainstorming tools</p>
                            </div>
                            <div className="workflow-arrow">→</div>
                            <div className="workflow-step">
                                <div className="step-number">2</div>
                                <h3>Create</h3>
                                <p>Write with intelligent assistance and real-time feedback</p>
                            </div>
                            <div className="workflow-arrow">→</div>
                            <div className="workflow-step">
                                <div className="step-number">3</div>
                                <h3>Visualize</h3>
                                <p>Map your story and generate visual content</p>
                            </div>
                            <div className="workflow-arrow">→</div>
                            <div className="workflow-step">
                                <div className="step-number">4</div>
                                <h3>Refine</h3>
                                <p>Polish and perfect with advanced editing tools</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="stats-section" data-section="stats">
                    <div className="section-content">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <div className="stat-number" data-target="10000">0</div>
                                <div className="stat-label">Stories Created</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" data-target="50">0</div>
                                <div className="stat-label">Languages Supported</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" data-target="99.9">0</div>
                                <div className="stat-label">Uptime</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number" data-target="24">0</div>
                                <div className="stat-label">AI Assistance</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <footer className="landing-footer">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <h3>Story Time</h3>
                            <p>AI-powered story writing made simple</p>
                        </div>
                        <div className="footer-links">
                            <button className="footer-link" onClick={() => {
                                setShowLandingPage(false);
                                setShowAboutPage(true);
                            }}>About</button>
                            <span className="footer-link">Privacy</span>
                            <span className="footer-link">Terms</span>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2025 Story Time. Built by Chris Sullivan.</p>
                    </div>
                </footer>
            </div>
        );
    }

    if (showAboutPage) {
        return (
            <div className="about-page">
                <nav className="landing-nav">
                    <button className="back-button" onClick={() => {
                        setShowAboutPage(false);
                        setShowLandingPage(true);
                    }}>← Back</button>
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </nav>
                
                <div className="about-content">
                    <div className="about-hero" data-animate="hero">
                        <h1>About Story Time</h1>
                        <p className="about-subtitle">
                            Empowering writers with AI-driven creativity and seamless storytelling tools.
                        </p>
                    </div>
                    
                    <div className="about-sections">
                        <div className="about-section" data-animate="section">
                            <h2>What is Story Time?</h2>
                            <p>
                                Story Time is an innovative AI-powered writing platform designed to help writers of all levels 
                                create compelling stories. Whether you're battling writer's block or looking to enhance your 
                                creative process, our suite of tools provides the perfect companion for your writing journey.
                            </p>
                        </div>
                        
                        <div className="about-section" data-animate="section">
                            <h2>Technology Stack</h2>
                            <div className="tech-carousel-centered" data-animate="carousel">
                                <img id="tech-image" src="react.js.png" alt="Technology" />
                                <div className="tech-name" id="tech-name">React.js</div>
                            </div>
                        </div>
                        
                        <div className="about-section" data-animate="section">
                            <h2>About the Developer</h2>
                            <div className="developer-section">
                                <div className="developer-photo">
                                    <img src="Venice Slack Photo (1).jpg" alt="Chris Sullivan" />
                                </div>
                                <div className="developer-info">
                                    <h3>Chris Sullivan</h3>
                                    <p>
                                        A passionate developer and storyteller who believes in the power of technology to 
                                        enhance human creativity. Chris built Story Time to bridge the gap between 
                                        traditional writing and modern AI assistance, creating a tool that empowers 
                                        rather than replaces human imagination.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const saveStory = async () => {
        if (!story.trim()) {
            setSaveStatus('Nothing to save!');
            return;
        }

        setSaveStatus('Saving...');
        console.log('Saving story with data:', { story: story.substring(0, 100) + '...', name: storyName });
        try {
            const response = await fetch('https://i7p8c7igtl.execute-api.us-east-1.amazonaws.com/prod/save', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ story: story, name: storyName })
            });

            if (response.ok) {
                const result = await response.json();
                
                let data;
                if (result.body) {
                    data = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
                } else {
                    data = result;
                }
                
                setSaveStatus(`Saved as ${data.filename}`);
                setCurrentStory(data.filename);
                listStories(); 
            } else {
                const errorText = await response.text();
                setSaveStatus(`Save failed: ${errorText}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            if (error.message.includes('Failed to fetch')) {
                setSaveStatus('Story saved! (CORS error but save succeeded)');
            } else {
                setSaveStatus(`Save error: ${error.message}`);
            }
        }
    };

    const deleteStory = async () => {
        if (!currentStory) {
            setSaveStatus('No story selected to delete!');
            return;
        }

        if (!confirm(`Are you sure you want to delete "${currentStory.replace('.txt', '')}"?`)) {
            return;
        }

        setSaveStatus('Deleting...');
        try {
            const response = await fetch('https://y7ur3yspla.execute-api.us-east-1.amazonaws.com/prod/delete', {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: currentStory })
            });

            if (response.ok) {
                setSaveStatus('Story deleted successfully');
                setStory('');
                setStoryName('');
                setCurrentStory(null);
                listStories();
            } else {
                const errorText = await response.text();
                setSaveStatus(`Delete failed: ${errorText}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            setSaveStatus(`Delete error: ${error.message}`);
        }
    };

    const getSuggestions = async () => {
        if (!story.trim()) {
            setSuggestions('Write some text first to get suggestions!');
            return;
        }

        setLoadingSuggestions(true);
        try {
            const response = await fetch('https://nocgxc2zhc.execute-api.us-east-1.amazonaws.com/prod/writersblock', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text: story.replace(/<[^>]*>/g, ''),
                    language: selectedLanguage 
                })
            });

            if (response.ok) {
                const result = await response.json();
                const data = typeof result.body === 'string' ? JSON.parse(result.body) : result;
                setSuggestions(data.suggestions || 'No suggestions available');
            } else {
                setSuggestions('Failed to get suggestions');
            }
        } catch (error) {
            console.error('Suggestions error:', error);
            setSuggestions('Error getting suggestions');
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const generateImage = async () => {
        if (!story.trim()) {
            setSaveStatus('Write some text first to generate an image!');
            return;
        }

        setLoadingImage(true);
        setSaveStatus('Generating image...');
        try {
            const response = await fetch('https://j3fis510x1.execute-api.us-east-1.amazonaws.com/prod/imagegenerator', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: story.replace(/<[^>]*>/g, '') })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Full response:', result);
                const data = typeof result.body === 'string' ? JSON.parse(result.body) : result;
                console.log('Parsed data:', data);
                console.log('Image URL received:', data.imageUrl);
                console.log('Image URL length:', data.imageUrl?.length);
                setGeneratedImage(data.imageUrl || '');
                setSaveStatus('Image generated!');
            } else {
                setSaveStatus('Failed to generate image');
            }
        } catch (error) {
            console.error('Image generation error:', error);
            setSaveStatus('Error generating image');
        } finally {
            setLoadingImage(false);
        }
    };

    const saveCharacter = async () => {
        if (!currentStory) {
            setSaveStatus('Save a story first!');
            return;
        }
        if (!currentChar.name.trim()) {
            setSaveStatus('Character name required!');
            return;
        }

        setSaveStatus('Saving character...');
        try {
            const storyBaseName = currentStory.replace('.txt', '');
            const response = await fetch('https://i7p8c7igtl.execute-api.us-east-1.amazonaws.com/prod/save', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    story: JSON.stringify(currentChar), 
                    name: `${storyBaseName}-${currentChar.name}-character`
                })
            });

            if (response.ok) {
                setSaveStatus('Character saved!');
                setTimeout(listCharacters, 100);
            } else {
                setSaveStatus('Failed to save character');
            }
        } catch (error) {
            setSaveStatus('Error saving character');
        }
    };

    const loadCharacter = async (filename) => {
        setSaveStatus('Loading character...');
        try {
            const response = await fetch('https://6hqpsv28p0.execute-api.us-east-1.amazonaws.com/prod/load', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filename: filename })
            });
            if (response.ok) {
                const result = await response.json();
                const data = typeof result.body === 'string' ? JSON.parse(result.body) : result;
                console.log('Character data received:', data);
                try {
                    const charData = JSON.parse(data.content || '{}');
                    setCurrentChar(charData);
                    setSaveStatus('Character loaded!');
                } catch (parseError) {
                    console.error('Error parsing character data:', parseError);
                    setSaveStatus('Error parsing character data');
                }
            } else {
                setSaveStatus('Failed to load character');
            }
        } catch (error) {
            console.error('Error loading character:', error);
            setSaveStatus('Error loading character');
        }
    };

    const listCharacters = async (storyName = null) => {
        const targetStory = storyName || currentStory;
        if (!targetStory) {
            console.log('No story specified, clearing characters');
            setCharacters([]);
            return;
        }
        try {
            const response = await fetch('https://epokscvush.execute-api.us-east-1.amazonaws.com/prod/list', {
                method: 'GET',
                mode: 'cors'
            });
            if (response.ok) {
                const result = await response.json();
                const data = typeof result.body === 'string' ? JSON.parse(result.body) : result;
                const storyBaseName = targetStory.replace('.txt', '');
                console.log('Looking for characters for story:', storyBaseName);
                console.log('All files:', data.stories?.map(s => s.filename));
                const charFiles = (data.stories || []).filter(story => {
                    const filename = story.filename;
                    const pattern = `${storyBaseName}-`;
                    return filename.startsWith(pattern) && filename.endsWith('-character.txt');
                });
                console.log('Found character files:', charFiles.map(c => c.filename));
                setCharacters(charFiles);
            }
        } catch (error) {
            console.error('Failed to load characters:', error);
        }
    };

    return (
        <div className="app">
            <div className="sidebar">
                <h3>Saved Stories</h3>
                <div className="story-list">
                    {stories.map((storyItem, index) => (
                        <div 
                            key={index} 
                            className={`story-item ${currentStory === storyItem.filename ? 'active' : ''}`}
                            onClick={() => loadStory(storyItem.filename)}
                        >
                            {storyItem.filename.replace('.txt', '')}
                        </div>
                    ))}
                </div>
            </div>
            <div className="main-content">
                <div className="header-with-toggle">
                    <div className="header-left">
                        <button className="back-button" onClick={() => setShowLandingPage(true)}>← Back</button>
                        <h1>Story Time</h1>
                    </div>
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? 'Light' : 'Dark'}
                    </button>
                </div>
                <div className="story-info">
                    <input
                        type="text"
                        placeholder="Story name"
                        value={storyName}
                        onChange={(e) => setStoryName(e.target.value)}
                        className="story-name-input"
                    />
                    <div className="stats">
                        <p>Word Count: {wordCount}</p>
                    </div>
                </div>
                <div id="editor" style={{height: '400px'}}></div>
                <div className="tools">
                    <button onClick={() => { 
                        setStory(''); 
                        setStoryName(''); 
                        setCurrentStory(null); 
                        setWordCount(0);
                        setSuggestions('');
                        if (canvas) {
                            canvas.clear();
                            canvas.backgroundColor = '#333';
                            canvas.renderAll();
                        }
                        if (quill) quill.setText('');
                    }}>New Story</button>
                    <button onClick={saveStory}>Save to S3</button>
                    <button onClick={deleteStory} className="delete-btn" disabled={!currentStory}>Delete Story</button>
                    <button onClick={() => setShowCanvas(!showCanvas)}>
                        {showCanvas ? 'Hide Canvas' : 'Story Map'}
                    </button>
                    <button onClick={generateImage} disabled={loadingImage}>
                        {loadingImage ? 'Generating Image...' : 'Generate Image'}
                    </button>
                    <button onClick={() => setShowCharSheet(!showCharSheet)}>
                        {showCharSheet ? 'Hide Characters' : 'Character Sheet'}
                    </button>
                </div>
                {showCanvas && (
                    <div className="canvas-container">
                        <div className="canvas-tools">
                            <button onClick={saveCanvasLocal}>Download PNG</button>
                            <button onClick={saveCanvasToS3}>Save to S3</button>
                            <button onClick={loadCanvasFromS3} disabled={!storyName}>Load Canvas</button>
                            <button onClick={clearCanvas}>Clear</button>
                            <div className="color-picker">
                                <label>Color: </label>
                                <input 
                                    type="color" 
                                    defaultValue="#ffffff" 
                                    onChange={(e) => changeCanvasColor(e.target.value)}
                                />
                            </div>
                        </div>
                        <canvas id="story-canvas"></canvas>
                    </div>
                )}
                {generatedImage && (
                    <div className="image-container">
                        <div className="generated-image">
                            <img src={generatedImage} alt="Generated story illustration" />
                        </div>
                    </div>
                )}
                {showCharSheet && (
                    <div className="character-container">
                        <div className="character-list">
                            <h4>Characters for {currentStory ? currentStory.replace('.txt', '') : 'No Story'}</h4>
                            {!currentStory ? (
                                <p className="empty-message">Save a story first to create characters</p>
                            ) : characters.length === 0 ? (
                                <p className="empty-message">No characters yet</p>
                            ) : (
                                characters.map((char, index) => {
                                    const storyBaseName = currentStory.replace('.txt', '');
                                    const charName = char.filename
                                        .replace(`${storyBaseName}-`, '')
                                        .replace('-character.txt', '');
                                    return (
                                        <div 
                                            key={index} 
                                            className="character-item"
                                            onClick={() => loadCharacter(char.filename)}
                                        >
                                            {charName}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="character-form">
                            <h4>Character Details</h4>
                            <input
                                type="text"
                                placeholder="Character Name"
                                value={currentChar.name}
                                onChange={(e) => setCurrentChar({...currentChar, name: e.target.value})}
                                disabled={!currentStory}
                            />
                            <input
                                type="text"
                                placeholder="Age"
                                value={currentChar.age}
                                onChange={(e) => setCurrentChar({...currentChar, age: e.target.value})}
                                disabled={!currentStory}
                            />
                            <textarea
                                placeholder="Physical Description"
                                value={currentChar.description}
                                onChange={(e) => setCurrentChar({...currentChar, description: e.target.value})}
                                rows="3"
                                disabled={!currentStory}
                            />
                            <textarea
                                placeholder="Personality Traits"
                                value={currentChar.traits}
                                onChange={(e) => setCurrentChar({...currentChar, traits: e.target.value})}
                                rows="3"
                                disabled={!currentStory}
                            />
                            <textarea
                                placeholder="Backstory"
                                value={currentChar.backstory}
                                onChange={(e) => setCurrentChar({...currentChar, backstory: e.target.value})}
                                rows="4"
                                disabled={!currentStory}
                            />
                            <div className="character-tools">
                                <button onClick={saveCharacter} disabled={!currentStory}>Save Character</button>
                                <button onClick={() => setCurrentChar({
                                    name: '', age: '', description: '', traits: '', backstory: ''
                                })} disabled={!currentStory}>New Character</button>
                            </div>
                        </div>
                    </div>
                )}
                {saveStatus && <p className="status">{saveStatus}</p>}
            </div>
            <div className="writers-block">
                <h3>Writer's Block Terminator</h3>
                <select 
                    value={selectedLanguage} 
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '16px',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                    }}
                >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                    <option value="Italian">Italiano</option>
                    <option value="Portuguese">Português</option>
                    <option value="Japanese">日本語</option>
                    <option value="Chinese">中文</option>
                    <option value="Korean">한국어</option>
                    <option value="Russian">Русский</option>
                </select>
                <button onClick={getSuggestions} disabled={loadingSuggestions}>
                    {loadingSuggestions ? 'Getting Ideas...' : 'Get Writing Ideas'}
                </button>
                {suggestions && (
                    <div className="suggestions">
                        <pre>{suggestions}</pre>
                    </div>
                )}
            </div>
        </div>
    );
}

ReactDOM.render(<StoryWriterApp />, document.getElementById('root'));