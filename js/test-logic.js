// Test questions data
const testQuestions = [
  {
    id: 1,
    text: "你们在一起时即使不说话，是否也感到舒适自在？",
    options: ["是", "否"]
  },
  {
    id: 2,
    text: "你们对婚姻、家庭、金钱等人生大事的看法是否基本一致？",
    options: ["是", "否"]
  },
  {
    id: 3,
    text: "TA是否能敏锐察觉你的情绪变化并主动关心？",
    options: ["是", "否"]
  },
  {
    id: 4,
    text: "你是否能毫无压力地向TA展现真实自我（包括缺点）？",
    options: ["是", "否"]
  },
  {
    id: 5,
    text: "发生矛盾时，你们是否更关注解决问题而非争输赢？",
    options: ["是", "否"]
  },
  {
    id: 6,
    text: "你们是否支持彼此追求理想，并为对方进步感到欣喜？",
    options: ["是", "否"]
  },
  {
    id: 7,
    text: "你是否无需查手机/盘问行踪就对TA有天然信任感？",
    options: ["是", "否"]
  },
  {
    id: 8,
    text: "你们是否常有"异口同声"或"同时想到同一件事"的瞬间？",
    options: ["是", "否"]
  },
  {
    id: 9,
    text: "当TA需要帮助时，你是否愿意暂时放下自己的利益？",
    options: ["是", "否"]
  },
  {
    id: 10,
    text: "想象10年后的生活，你是否期待画面中仍有TA的存在？",
    options: ["是", "否"]
  }
];

// User answers
let userAnswers = Array(testQuestions.length).fill(null);
let currentQuestionIndex = 0;

// Initialize test
function initTest() {
  loadQuestion(currentQuestionIndex);
  updateNavButtons();
}

// Load question
function loadQuestion(index) {
  const question = testQuestions[index];
  const questionContainer = document.getElementById('question-container');
  
  // Create question content
  const content = `
    <div class="question-number">问题 ${question.id}/10</div>
    <div class="question-text">${question.text}</div>
    <div class="question-options">
      ${question.options.map((option, optionIndex) => `
        <div class="option ${userAnswers[index] === optionIndex ? 'selected' : ''}" 
             onclick="selectOption(this, ${optionIndex})">
          <div class="option-radio"></div>
          <div class="option-text">${option}</div>
        </div>
      `).join('')}
    </div>
  `;
  
  questionContainer.innerHTML = content;
  
  // Update progress bar
  const progressPercentage = ((index + 1) / testQuestions.length) * 100;
  document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
  
  updateNavButtons();
}

// Select an option
function selectOption(element, optionIndex) {
  // Remove selected class from all options
  const options = document.querySelectorAll('.option');
  options.forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selected class to clicked option
  element.classList.add('selected');
  
  // Save user's answer
  userAnswers[currentQuestionIndex] = optionIndex;
  
  // Enable next button
  const nextButton = document.getElementById('next-button');
  nextButton.classList.remove('btn-disabled');
  
  // Auto-navigate to next question after a short delay
  if (currentQuestionIndex < testQuestions.length - 1) {
    setTimeout(() => {
      nextQuestion();
    }, 800);
  } else {
    // If it's the last question, highlight the "View Results" button
    nextButton.classList.add('pulse-animation');
  }
  
  updateNavButtons();
}

// Update navigation buttons state
function updateNavButtons() {
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');
  
  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.textContent = currentQuestionIndex === testQuestions.length - 1 ? '查看结果' : '下一题';
  
  // Add visual indication if answer is selected
  if (userAnswers[currentQuestionIndex] !== null) {
    nextButton.classList.remove('btn-disabled');
  } else {
    nextButton.classList.add('btn-disabled');
  }
}

// Navigate to previous question
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion(currentQuestionIndex);
  }
}

// Navigate to next question or show results
function nextQuestion() {
  // Only proceed if an option is selected
  if (userAnswers[currentQuestionIndex] === null) {
    // If no option is selected, just return without doing anything
    return;
  }
  
  if (currentQuestionIndex < testQuestions.length - 1) {
    currentQuestionIndex++;
    loadQuestion(currentQuestionIndex);
  } else {
    // Calculate score and redirect to results
    const score = calculateScore();
    localStorage.setItem('testScore', score);
    window.location.href = 'results.html';
  }
}

// Calculate test score
function calculateScore() {
  // Count "是" answers (option index 0)
  return userAnswers.filter(answer => answer === 0).length;
}

// Generate a shareable image
async function generateShareableImage(score) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = 800;
    canvas.height = 1200;
    
    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gradient border
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#8e44ad');
    gradient.addColorStop(1, '#3498db');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Title
    ctx.fillStyle = '#8e44ad';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('灵魂伴侣测试结果', canvas.width/2, 150);
    
    // Score
    ctx.beginPath();
    ctx.arc(canvas.width/2, 350, 120, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.stroke();
    
    ctx.fillStyle = '#8e44ad';
    ctx.font = 'bold 120px Arial';
    ctx.fillText(score, canvas.width/2, 380);
    
    ctx.fillStyle = '#666';
    ctx.font = '40px Arial';
    ctx.fillText('/ 10', canvas.width/2, 440);
    
    // Interpretation
    let interpretation = '';
    if (score >= 8) {
      interpretation = '强烈灵魂伴侣特质！';
    } else if (score >= 5) {
      interpretation = '深度契合但有提升空间';
    } else {
      interpretation = '建议深入沟通关键分歧点';
    }
    
    ctx.fillStyle = '#8e44ad';
    ctx.font = 'bold 40px Arial';
    ctx.fillText(interpretation, canvas.width/2, 550);
    
    // Description
    ctx.fillStyle = '#333';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    const descText = `你们的契合度达到了${score}分，这表明你们之间${
      score >= 8 ? '存在很强的灵魂伴侣特质。你们在情感共鸣、价值观、相互信任等核心维度表现出高度一致性。' : 
      score >= 5 ? '有着良好的灵魂契合基础，但在某些关键维度仍有提升空间。' : 
      '在关键维度存在一些分歧，建议通过深入沟通增进彼此理解。'
    }`;
    
    wrapText(ctx, descText, canvas.width/2, 650, canvas.width - 100, 40);
    
    // QR Code placeholder
    ctx.fillStyle = '#eee';
    ctx.fillRect(canvas.width/2 - 75, 900, 150, 150);
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.fillText('扫码进行测试', canvas.width/2, 1080);
    
    // App name and logo
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('灵魂伴侣测试 App', canvas.width/2, 1140);
    
    // Convert to image
    resolve(canvas.toDataURL('image/png'));
  });
}

// Helper function to wrap text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  let lineArray = [];
  
  // Break by spaces first (for Latin languages)
  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lineArray.push({text: line, x, y});
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  
  // Handle Chinese, Japanese, Korean text that doesn't use spaces
  if (lineArray.length === 0 && text.length > 0) {
    let tempLine = '';
    for (let i = 0; i < text.length; i++) {
      tempLine += text[i];
      if (ctx.measureText(tempLine).width > maxWidth) {
        lineArray.push({text: tempLine.slice(0, -1), x, y});
        tempLine = text[i];
        y += lineHeight;
      }
    }
    if (tempLine.length > 0) {
      lineArray.push({text: tempLine, x, y});
    }
  } else {
    lineArray.push({text: line, x, y});
  }
  
  // Draw all lines
  lineArray.forEach(line => {
    ctx.fillText(line.text, line.x, line.y);
  });
}

// Generate a shareable link
function generateShareableLink(score) {
  const baseUrl = window.location.origin + window.location.pathname.replace('results.html', '').replace('app/', '');
  const shareUrl = `${baseUrl}share.html?score=${score}`;
  return shareUrl;
}

// Share result via native sharing
async function shareResult(score) {
  try {
    // Generate shareable image and link
    const imageUrl = await generateShareableImage(score);
    const shareUrl = generateShareableLink(score);
    
    // Show share modal
    const shareModal = document.getElementById('share-modal');
    const shareImage = document.getElementById('share-image');
    const shareLink = document.getElementById('share-link');
    
    shareImage.src = imageUrl;
    shareLink.value = shareUrl;
    shareModal.style.display = 'flex';
    
    // Download functionality
    document.getElementById('download-image').onclick = () => {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'soulmate-test-result.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    
    // Copy link functionality
    document.getElementById('copy-link').onclick = () => {
      shareLink.select();
      document.execCommand('copy');
      alert('链接已复制到剪贴板');
    };
    
    // Try native sharing if available
    if (navigator.share) {
      document.getElementById('native-share').style.display = 'block';
      document.getElementById('native-share').onclick = async () => {
        try {
          // Create blob from data URL
          const blob = await (await fetch(imageUrl)).blob();
          
          // Prepare share data
          const shareData = {
            title: '灵魂伴侣测试结果',
            text: `我的灵魂伴侣契合度得分是 ${score}/10！快来测测你的分数吧！`,
            url: shareUrl
          };
          
          // Add file if supported
          if (navigator.canShare && blob) {
            try {
              shareData.files = [
                new File([blob], 'soulmate-test-result.png', { type: 'image/png' })
              ];
            } catch (e) {
              console.log('File sharing not supported', e);
            }
          }
          
          await navigator.share(shareData);
        } catch (e) {
          console.error('Native sharing failed:', e);
        }
      };
    } else {
      document.getElementById('native-share').style.display = 'none';
    }
  } catch (error) {
    console.error('分享失败:', error);
    alert('分享失败，请重试');
  }
}

// Close share modal
function closeShareModal() {
  document.getElementById('share-modal').style.display = 'none';
}

// Social media sharing functions
function shareToWeChat() {
  alert('请截图保存，并在微信中分享');
}

function shareToWeibo() {
  const score = localStorage.getItem('testScore') || 8;
  const text = `我的灵魂伴侣契合度得分是 ${score}/10！快来测测你的分数吧！`;
  const url = generateShareableLink(score);
  window.open(`http://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
}