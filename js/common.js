// 共通JavaScript関数

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // スムーススクロール
    initSmoothScroll();
    
    // フォームバリデーション
    initFormValidation();
    
    // モバイルメニュー
    initMobileMenu();
    
    // アニメーション
    initAnimations();
});

// スムーススクロール
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// フォームバリデーション
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let hasErrors = false;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    showFieldError(field, '必須項目です');
                    hasErrors = true;
                } else {
                    clearFieldError(field);
                }
            });
            
            if (hasErrors) {
                e.preventDefault();
            }
        });
    });
}

// フィールドエラー表示
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    field.style.borderColor = '#ef4444';
    field.parentNode.appendChild(errorDiv);
}

// フィールドエラークリア
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e5e7eb';
}

// モバイルメニュー
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }
}

// 要素が画面に入ったときのアニメーション
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 診断機能
class DiagnosisTool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 0;
        this.answers = {};
        this.questions = [
            {
                id: 'employment_status',
                title: '現在の状況を教えてください',
                type: 'radio',
                options: [
                    { value: 'before_resignation', text: '退職前（在職中）' },
                    { value: 'after_resignation', text: '退職後' }
                ]
            },
            {
                id: 'resignation_reason',
                title: '退職理由を教えてください',
                type: 'radio',
                options: [
                    { value: 'voluntary', text: '自己都合退職' },
                    { value: 'company_circumstances', text: '会社都合退職' }
                ]
            },
            {
                id: 'medical_diagnosis',
                title: '医師による診断書はありますか？',
                type: 'radio',
                options: [
                    { value: 'yes', text: 'はい（診断書あり）' },
                    { value: 'no', text: 'いいえ（診断書なし）' }
                ]
            },
            {
                id: 'immediate_job_search',
                title: 'すぐに転職したいですか？',
                type: 'radio',
                options: [
                    { value: 'yes', text: 'はい（すぐに転職したい）' },
                    { value: 'no', text: 'いいえ（時間をかけたい）' }
                ]
            },
            {
                id: 'benefit_priority',
                title: '受給に関する優先度は？',
                type: 'radio',
                options: [
                    { value: 'maximize_amount', text: '受給金額を最大化したい' },
                    { value: 'quick_start', text: 'とにかく早く受給を開始したい' }
                ]
            }
        ];
        this.init();
    }
    
    init() {
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        const question = this.questions[this.currentStep];
        if (!question) {
            this.showResults();
            return;
        }
        
        const html = `
            <div class="diagnosis-step">
                <div class="step-indicator">
                    <span>質問 ${this.currentStep + 1} / ${this.questions.length}</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${((this.currentStep + 1) / this.questions.length) * 100}%"></div>
                    </div>
                </div>
                
                <div class="question-content">
                    <h3 class="question-title">${question.title}</h3>
                    
                    <div class="options">
                        ${question.options.map(option => `
                            <label class="option-label">
                                <input type="radio" name="${question.id}" value="${option.value}">
                                <span class="option-text">${option.text}</span>
                            </label>
                        `).join('')}
                    </div>
                    
                    <div class="navigation-buttons">
                        ${this.currentStep > 0 ? '<button class="btn btn-secondary" onclick="diagnosisTool.previousStep()">戻る</button>' : ''}
                        <button class="btn btn-primary" onclick="diagnosisTool.nextStep()">次へ</button>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }
    
    nextStep() {
        const question = this.questions[this.currentStep];
        const selectedOption = this.container.querySelector(`input[name="${question.id}"]:checked`);
        
        if (!selectedOption) {
            alert('選択肢を選んでください');
            return;
        }
        
        this.answers[question.id] = selectedOption.value;
        this.currentStep++;
        this.render();
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }
    
    showResults() {
        const result = this.calculateResult();
        
        const html = `
            <div class="diagnosis-results">
                <h3>診断結果</h3>
                
                <div class="result-card">
                    <div class="result-title">${result.title}</div>
                    <div class="result-amount">最大 ${result.maxAmount}万円</div>
                    <div class="result-description">${result.description}</div>
                    <div class="result-period">受給期間: ${result.period}</div>
                </div>
                
                <div class="recommended-steps">
                    <h4>推奨される手順</h4>
                    <ol>
                        ${result.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="action-buttons">
                    <a href="${result.detailUrl}" class="btn btn-primary btn-large">詳細を見る</a>
                    <button class="btn btn-secondary" onclick="diagnosisTool.restart()">診断をやり直す</button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }
    
    calculateResult() {
        const { employment_status, resignation_reason, medical_diagnosis, immediate_job_search, benefit_priority } = this.answers;
        
        // 診断ロジック
        if (medical_diagnosis === 'yes') {
            if (employment_status === 'before_resignation') {
                return {
                    title: '傷病手当金 + 失業給付の最適化プラン',
                    maxAmount: '250',
                    description: '医師の診断書を活用し、傷病手当金と失業給付を組み合わせることで最大の受給が可能です。',
                    period: '最大10ヶ月',
                    steps: [
                        '医師による診断書の準備',
                        '退職前の傷病手当金申請準備',
                        '退職手続きの最適化',
                        'ハローワークでの申請',
                        '継続的な受給手続き'
                    ],
                    detailUrl: '/diagnosis/medical-optimized.html'
                };
            } else {
                return {
                    title: '退職後の傷病手当金活用プラン',
                    maxAmount: '180',
                    description: '退職後でも医師の診断書により、失業給付の延長が可能です。',
                    period: '最大7ヶ月',
                    steps: [
                        '医師による診断書の確認',
                        'ハローワークでの求職申込み',
                        '給付制限の短縮申請',
                        '受給期間延長の手続き'
                    ],
                    detailUrl: '/diagnosis/post-resignation-medical.html'
                };
            }
        } else {
            if (resignation_reason === 'company_circumstances') {
                return {
                    title: '会社都合退職の優遇プラン',
                    maxAmount: '120',
                    description: '会社都合退職により給付制限なしで早期受給が可能です。',
                    period: '最大5ヶ月',
                    steps: [
                        '退職理由の証明書準備',
                        'ハローワークでの求職申込み',
                        '給付制限なしでの受給開始',
                        '再就職手当の活用'
                    ],
                    detailUrl: '/diagnosis/company-circumstances.html'
                };
            } else {
                if (benefit_priority === 'quick_start') {
                    return {
                        title: '早期受給開始プラン',
                        maxAmount: '90',
                        description: '最短期間での受給開始を重視したプランです。',
                        period: '3-4ヶ月',
                        steps: [
                            'ハローワークでの求職申込み',
                            '職業訓練の検討',
                            '積極的な就職活動',
                            '早期の再就職手当獲得'
                        ],
                        detailUrl: '/diagnosis/quick-start.html'
                    };
                } else {
                    return {
                        title: '標準的な失業給付プラン',
                        maxAmount: '100',
                        description: '一般的な自己都合退職での失業給付プランです。',
                        period: '3ヶ月',
                        steps: [
                            'ハローワークでの求職申込み',
                            '3ヶ月の給付制限期間',
                            '基本手当の受給',
                            '就職活動の継続'
                        ],
                        detailUrl: '/diagnosis/standard.html'
                    };
                }
            }
        }
    }
    
    restart() {
        this.currentStep = 0;
        this.answers = {};
        this.render();
    }
}

// ページ遷移関数
function navigateTo(url) {
    window.location.href = url;
}

// 数値のフォーマット（カンマ区切り）
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 日付フォーマット
function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// ローカルストレージ操作
const Storage = {
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    get: function(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    }
};

// 診断結果の保存
function saveDiagnosisResult(result) {
    Storage.set('diagnosis_result', result);
}

// 診断結果の取得
function getDiagnosisResult() {
    return Storage.get('diagnosis_result');
}

// よくある質問の表示切り替え
function toggleFAQ(element) {
    const content = element.nextElementSibling;
    const isOpen = content.style.display === 'block';
    
    // 全てのFAQを閉じる
    document.querySelectorAll('.faq-content').forEach(item => {
        item.style.display = 'none';
    });
    
    // クリックされたFAQの状態を切り替え
    if (!isOpen) {
        content.style.display = 'block';
    }
}

// メール形式チェック
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 電話番号形式チェック
function isValidPhone(phone) {
    const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{4}$/;
    return phoneRegex.test(phone);
}