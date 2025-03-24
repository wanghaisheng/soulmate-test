// DOM Elements
const uiTabs = document.querySelectorAll('.ui-tab');
const faqItems = document.querySelectorAll('.faq-item');
const styleName = document.getElementById('style-name');
const styleDescription = document.getElementById('style-description');

// UI Style Definitions
const uiStyles = {
  base: {
    name: '基础风格',
    description: '简洁优雅的设计，专注于用户体验和内容呈现，适合各年龄段用户。',
    frames: [
      'apps/base/index.html',
      'apps/base/onboarding-preview/index.html',
      'apps/base/app/test.html',
      'apps/base/app/results.html',
      'apps/base/paywall-preview/index.html'
    ]
  },
  minimal: {
    name: '极简风格',
    description: '极致简约的设计，采用黑白主色调和大量留白，为注重简洁的用户提供纯粹体验。',
    frames: [
      'apps/minimal/index.html',
      'apps/minimal/onboarding-preview/index.html',
      'apps/minimal/app/test.html',
      'apps/minimal/app/results.html',
      'apps/minimal/paywall-preview/index.html'
    ]
  },
  colorful: {
    name: '活力风格',
    description: '充满活力的色彩和动感设计，使用渐变色和动画效果，适合年轻用户群体。',
    frames: [
      'apps/colorful/index.html',
      'apps/colorful/onboarding-preview/index.html',
      'apps/colorful/app/test.html',
      'apps/colorful/app/results.html',
      'apps/colorful/paywall-preview/index.html'
    ]
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
  // Set active UI tab
  uiTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      uiTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Update style information
      const style = tab.getAttribute('data-style');
      updateStyleInfo(style);
      
      // Update iframe sources
      updatePreviewFrames(style);
      
      // Update demo link
      updateDemoLink(style);
    });
  });
  
  // FAQ accordion
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(i => {
        if (i !== item && i.classList.contains('active')) {
          i.classList.remove('active');
        }
      });
      
      // Toggle active class on clicked item
      item.classList.toggle('active');
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});

// Function to update style information
function updateStyleInfo(style) {
  const styleInfo = uiStyles[style];
  styleName.textContent = styleInfo.name;
  styleDescription.textContent = styleInfo.description;
}

// Function to update preview frames
function updatePreviewFrames(style) {
  const frames = document.querySelectorAll('.phone-frame iframe');
  const styleInfo = uiStyles[style];
  
  frames.forEach((frame, index) => {
    if (styleInfo.frames[index]) {
      frame.src = styleInfo.frames[index];
    }
  });
}

// Function to update full demo link
function updateDemoLink(style) {
  const demoLink = document.querySelector('.preview-cta .btn');
  demoLink.setAttribute('href', `apps/${style}/index.html`);
}

// Responsive behavior for navbar
const handleScroll = () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll);

