# 📚 Story Time - AI-Powered Creative Writing Platform

[![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20S3%20%7C%20Bedrock-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.9-green?style=for-the-badge&logo=python)](https://python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

> **Transform your ideas into captivating stories with AI-powered writing assistance, visual story mapping, and intelligent character development.**

![Story Time Banner](awsbedrock.png)

## 🌟 Features

### ✍️ **AI Writing Assistant**
- **Writer's Block Terminator**: Get intelligent suggestions powered by AWS Bedrock
- **Multi-language Support**: Write in 10+ languages including English, Spanish, French, Japanese, Chinese
- **Context-Aware Prompts**: AI understands your story's context and genre

### 🎨 **Visual Story Mapping**
- **Interactive Canvas**: Draw story maps, character relationships, and plot diagrams
- **Cloud Storage**: Save and load your visual creations from AWS S3
- **Export Options**: Download as PNG or save directly to cloud

### 🎭 **Character Development**
- **Detailed Character Sheets**: Track names, ages, descriptions, traits, and backstories
- **Story-Linked Characters**: Characters are automatically associated with their stories
- **Persistent Storage**: All character data saved securely in the cloud

### 🖼️ **AI Image Generation**
- **Story Illustrations**: Generate beautiful artwork based on your story content
- **AWS Titan Integration**: Powered by Amazon Titan Image Generator
- **Automatic Storage**: Generated images saved to S3 with presigned URLs

### 💾 **Cloud-Native Storage**
- **Real-time Saving**: Auto-save to AWS S3 with instant feedback
- **Story Management**: List, load, and delete stories with ease
- **Version Control**: Track story modifications with timestamps

## 🏗️ Architecture

### **Frontend Stack**
```
React 18 + Vanilla JavaScript
├── Quill.js - Rich text editor
├── Fabric.js - Interactive canvas
├── Lottie - Smooth animations
└── CSS3 - Modern responsive design
```

### **Backend Infrastructure**
```
AWS Serverless Architecture
├── AWS Lambda - Serverless compute
├── Amazon S3 - Object storage
├── AWS Bedrock - AI/ML services
├── API Gateway - RESTful APIs
└── CloudWatch - Monitoring & logs
```

### **AI/ML Services**
- **AWS Bedrock**: Claude 3 for writing assistance
- **Amazon Titan**: Image generation from text
- **Natural Language Processing**: Multi-language story analysis

## 🚀 Quick Start

### Prerequisites
- AWS Account with Bedrock access
- S3 bucket configured
- Lambda functions deployed

### Local Development
```bash
# Clone the repository
git clone https://github.com/ChristopherSullivan9589/StoryTime.git
cd StoryTime

# Open in browser
open index.html
```

### AWS Deployment
1. **Create S3 Bucket**: `capstone-story-project`
2. **Deploy Lambda Functions**: Use the provided Python files
3. **Configure API Gateway**: Set up CORS and endpoints
4. **Enable Bedrock**: Request access to Claude 3 and Titan models

## 📁 Project Structure

```
StoryTime/
├── 📄 index.html              # Main application entry
├── ⚛️ app.js                  # React application logic
├── 🎨 style.css               # Modern CSS styling
├── 🐍 Lambda Functions/
│   ├── save-to-s3.py          # Story & canvas saving
│   ├── load-story.py          # Story retrieval
│   ├── list-story.py          # Story listing
│   ├── delete-story.py        # Story deletion
│   ├── canvas-load.py         # Canvas image loading
│   └── image-generator.py     # AI image generation
├── 🖼️ Assets/
│   ├── react.js.png           # Tech stack icons
│   ├── awslambda.png
│   ├── awss3.png
│   └── awsbedrock.png
└── 📋 README.md               # This file
```

## 🔧 Lambda Functions

### **save-to-s3.py**
```python
# Handles story, character, and canvas data storage
# Supports base64 image encoding for canvas saves
# Auto-detects content type and file extensions
```

### **image-generator.py**
```python
# Integrates with Amazon Titan Image Generator
# Processes story text into artistic prompts
# Returns presigned S3 URLs for generated images
```

### **delete-story.py**
```python
# Secure story deletion with existence validation
# CORS-enabled for frontend integration
# Error handling for missing files
```

## 🎯 API Endpoints

| Endpoint | Method | Function | Description |
|----------|--------|----------|-------------|
| `/save` | POST | save-to-s3 | Save stories, characters, canvas |
| `/load` | POST | load-story | Retrieve story content |
| `/list` | GET | list-story | List all saved stories |
| `/delete` | DELETE | delete-story | Remove stories |
| `/canvas` | POST | canvas-load | Load canvas images |
| `/imagegenerator` | POST | image-generator | Generate AI artwork |
| `/writersblock` | POST | writers-block | Get AI writing suggestions |

## 🌐 Multi-Language Support

Story Time supports creative writing in multiple languages:

- 🇺🇸 **English** - Full feature support
- 🇪🇸 **Español** - AI assistance in Spanish
- 🇫🇷 **Français** - French writing support
- 🇩🇪 **Deutsch** - German language integration
- 🇮🇹 **Italiano** - Italian creative writing
- 🇵🇹 **Português** - Portuguese support
- 🇯🇵 **日本語** - Japanese storytelling
- 🇨🇳 **中文** - Chinese writing assistance
- 🇰🇷 **한국어** - Korean language support
- 🇷🇺 **Русский** - Russian creative writing

## 🎨 UI/UX Features

### **Dark/Light Theme**
- Seamless theme switching
- CSS custom properties for consistency
- Persistent user preferences

### **Responsive Design**
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions

### **Smooth Animations**
- Lottie integration for loading states
- CSS transitions for interactions
- Intersection Observer for scroll animations

### **Landing Page**
- Animated star field background
- Smooth scrolling sections
- Interactive statistics counters
- Technology showcase carousel

## 🔒 Security & Best Practices

- **CORS Configuration**: Proper cross-origin resource sharing
- **Input Validation**: Sanitized user inputs
- **Error Handling**: Comprehensive exception management
- **Presigned URLs**: Secure S3 access without exposing credentials
- **Content Type Validation**: File type verification

## 📊 Performance Optimizations

- **Serverless Architecture**: Auto-scaling Lambda functions
- **CDN Integration**: Fast asset delivery
- **Lazy Loading**: On-demand resource loading
- **Efficient State Management**: React hooks optimization
- **Debounced API Calls**: Reduced server requests

## 🛠️ Development Tools

- **Quill.js**: Rich text editing with toolbar customization
- **Fabric.js**: HTML5 canvas manipulation
- **Babel**: ES6+ JavaScript transpilation
- **AWS SDK**: Seamless cloud service integration

## 🚀 Deployment Guide

### **AWS Lambda Setup**
```bash
# Package dependencies
pip install boto3 -t .
zip -r function.zip .

# Deploy via AWS CLI
aws lambda create-function \
  --function-name story-save \
  --runtime python3.9 \
  --zip-file fileb://function.zip
```

### **S3 Configuration**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::capstone-story-project/*"
    }
  ]
}
```

## 📈 Future Enhancements

- [ ] **Collaborative Writing**: Real-time multi-user editing
- [ ] **Version Control**: Git-like story versioning
- [ ] **Publishing Integration**: Direct export to publishing platforms
- [ ] **Advanced AI**: GPT-4 integration for enhanced creativity
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Voice Integration**: Speech-to-text story creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Chris Sullivan**
- 🌐 Portfolio: [Coming Soon]
- 📧 Email: [Your Email]
- 💼 LinkedIn: [Your LinkedIn]
- 🐦 Twitter: [Your Twitter]

## 🙏 Acknowledgments

- **AWS** for providing robust cloud infrastructure
- **React Community** for excellent documentation
- **Open Source Contributors** for amazing libraries
- **Beta Testers** for valuable feedback

---

<div align="center">

**Built with ❤️ using AWS, React, and AI**

[⭐ Star this repo](https://github.com/ChristopherSullivan9589/StoryTime) | [🐛 Report Bug](https://github.com/ChristopherSullivan9589/StoryTime/issues) | [💡 Request Feature](https://github.com/ChristopherSullivan9589/StoryTime/issues)

</div>
