/**
 * FirebaseService - Замена Supabase для хранения данных
 * Использует Firebase Firestore для хранения данных пользователей
 */
export class FirebaseService {
    constructor() {
        this.isInitialized = false;
        this.db = null;
        this.auth = null;
        this.storage = null;
        this.currentUser = null;
        
        // Firebase конфигурация
        this.config = {
            apiKey: this.getApiKey(),
            authDomain: this.getAuthDomain(),
            projectId: this.getProjectId(),
            storageBucket: this.getStorageBucket(),
            messagingSenderId: this.getMessagingSenderId(),
            appId: this.getAppId()
        };
    }

    /**
     * Инициализация Firebase
     */
    async init() {
        try {
            // Загружаем Firebase SDK
            await this.loadFirebaseSDK();
            
            // Инициализируем Firebase
            if (window.firebase) {
                window.firebase.initializeApp(this.config);
                
                this.db = window.firebase.firestore();
                this.auth = window.firebase.auth();
                this.storage = window.firebase.storage();
                
                this.isInitialized = true;
                console.log('✅ FirebaseService инициализирован');
                
                // Настраиваем слушатели аутентификации
                this.setupAuthListeners();
                
            } else {
                throw new Error('Firebase SDK не загружен');
            }
            
        } catch (error) {
            console.error('❌ Ошибка инициализации FirebaseService:', error);
            throw error;
        }
    }

    /**
     * Загрузка Firebase SDK
     */
    loadFirebaseSDK() {
        return new Promise((resolve, reject) => {
            if (window.firebase) {
                resolve();
                return;
            }

            // Загружаем Firebase App
            const appScript = document.createElement('script');
            appScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
            appScript.onload = () => {
                // Загружаем Firebase Auth
                const authScript = document.createElement('script');
                authScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';
                authScript.onload = () => {
                    // Загружаем Firebase Firestore
                    const firestoreScript = document.createElement('script');
                    firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
                    firestoreScript.onload = () => {
                        // Загружаем Firebase Storage
                        const storageScript = document.createElement('script');
                        storageScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
                        storageScript.onload = resolve;
                        storageScript.onerror = reject;
                        document.head.appendChild(storageScript);
                    };
                    firestoreScript.onerror = reject;
                    document.head.appendChild(firestoreScript);
                };
                authScript.onerror = reject;
                document.head.appendChild(authScript);
            };
            appScript.onerror = reject;
            document.head.appendChild(appScript);
        });
    }

    /**
     * Получение конфигурационных параметров
     */
    getApiKey() {
        return localStorage.getItem('firebase-api-key') || '';
    }

    getAuthDomain() {
        return localStorage.getItem('firebase-auth-domain') || '';
    }

    getProjectId() {
        return localStorage.getItem('firebase-project-id') || '';
    }

    getStorageBucket() {
        return localStorage.getItem('firebase-storage-bucket') || '';
    }

    getMessagingSenderId() {
        return localStorage.getItem('firebase-messaging-sender-id') || '';
    }

    getAppId() {
        return localStorage.getItem('firebase-app-id') || '';
    }

    /**
     * Настройка слушателей аутентификации
     */
    setupAuthListeners() {
        this.auth.onAuthStateChanged((user) => {
            if (user) {
                this.currentUser = user;
                console.log('✅ Пользователь Firebase аутентифицирован:', user.email);
            } else {
                this.currentUser = null;
                console.log('👋 Пользователь Firebase вышел из системы');
            }
        });
    }

    /**
     * Google аутентификация через Firebase
     */
    async signInWithGoogle() {
        try {
            const provider = new window.firebase.auth.GoogleAuthProvider();
            
            // Добавляем дополнительные разрешения
            provider.addScope('https://www.googleapis.com/auth/calendar');
            provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
            provider.addScope('https://www.googleapis.com/auth/gmail.send');
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            
            const result = await this.auth.signInWithPopup(provider);
            
            // Получаем Google токен для API
            const credential = result.credential;
            const accessToken = credential.accessToken;
            
            // Сохраняем токен
            localStorage.setItem('google-access-token', accessToken);
            
            console.log('✅ Успешная аутентификация через Google');
            return result.user;
            
        } catch (error) {
            console.error('❌ Ошибка Google аутентификации:', error);
            throw error;
        }
    }

    /**
     * Выход из системы
     */
    async signOut() {
        try {
            await this.auth.signOut();
            localStorage.removeItem('google-access-token');
            console.log('✅ Пользователь вышел из системы');
            return true;
        } catch (error) {
            console.error('❌ Ошибка выхода:', error);
            throw error;
        }
    }

    /**
     * Получение текущего пользователя
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Проверка аутентификации
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Получение Google токена
     */
    async getGoogleAccessToken() {
        if (this.currentUser) {
            try {
                const token = await this.currentUser.getIdToken(true);
                return token;
            } catch (error) {
                console.error('❌ Ошибка получения токена:', error);
                return null;
            }
        }
        return null;
    }

    /**
     * Сохранение данных пользователя
     */
    async saveUserData(userData) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const userRef = this.db.collection('users').doc(this.currentUser.uid);
            await userRef.set({
                ...userData,
                updatedAt: new Date(),
                email: this.currentUser.email
            }, { merge: true });

            console.log('✅ Данные пользователя сохранены');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения данных:', error);
            throw error;
        }
    }

    /**
     * Получение данных пользователя
     */
    async getUserData() {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const userRef = this.db.collection('users').doc(this.currentUser.uid);
            const doc = await userRef.get();

            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('❌ Ошибка получения данных:', error);
            throw error;
        }
    }

    /**
     * Сохранение настроек
     */
    async saveSettings(settings) {
        try {
            const userData = await this.getUserData() || {};
            userData.settings = settings;
            await this.saveUserData(userData);
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения настроек:', error);
            throw error;
        }
    }

    /**
     * Получение настроек
     */
    async getSettings() {
        try {
            const userData = await this.getUserData();
            return userData?.settings || {};
        } catch (error) {
            console.error('❌ Ошибка получения настроек:', error);
            return {};
        }
    }

    /**
     * Сохранение истории чата
     */
    async saveChatHistory(conversationId, messages) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const chatRef = this.db.collection('users').doc(this.currentUser.uid)
                .collection('chats').doc(conversationId);
            
            await chatRef.set({
                conversationId,
                messages,
                updatedAt: new Date(),
                messageCount: messages.length
            });

            console.log('✅ История чата сохранена');
            return true;
        } catch (error) {
            console.error('❌ Ошибка сохранения истории чата:', error);
            throw error;
        }
    }

    /**
     * Получение истории чата
     */
    async getChatHistory(conversationId) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const chatRef = this.db.collection('users').doc(this.currentUser.uid)
                .collection('chats').doc(conversationId);
            
            const doc = await chatRef.get();
            
            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('❌ Ошибка получения истории чата:', error);
            return null;
        }
    }

    /**
     * Получение списка чатов
     */
    async getChatList() {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const chatsRef = this.db.collection('users').doc(this.currentUser.uid)
                .collection('chats');
            
            const snapshot = await chatsRef.orderBy('updatedAt', 'desc').get();
            
            const chats = [];
            snapshot.forEach(doc => {
                chats.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return chats;
        } catch (error) {
            console.error('❌ Ошибка получения списка чатов:', error);
            return [];
        }
    }

    /**
     * Удаление чата
     */
    async deleteChat(conversationId) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const chatRef = this.db.collection('users').doc(this.currentUser.uid)
                .collection('chats').doc(conversationId);
            
            await chatRef.delete();
            console.log('✅ Чат удален');
            return true;
        } catch (error) {
            console.error('❌ Ошибка удаления чата:', error);
            throw error;
        }
    }

    /**
     * Сохранение файла
     */
    async uploadFile(file, path) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const storageRef = this.storage.ref();
            const fileRef = storageRef.child(`users/${this.currentUser.uid}/${path}`);
            
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            console.log('✅ Файл загружен:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('❌ Ошибка загрузки файла:', error);
            throw error;
        }
    }

    /**
     * Удаление файла
     */
    async deleteFile(path) {
        try {
            if (!this.currentUser) {
                throw new Error('Пользователь не аутентифицирован');
            }

            const storageRef = this.storage.ref();
            const fileRef = storageRef.child(`users/${this.currentUser.uid}/${path}`);
            
            await fileRef.delete();
            console.log('✅ Файл удален');
            return true;
        } catch (error) {
            console.error('❌ Ошибка удаления файла:', error);
            throw error;
        }
    }

    /**
     * Настройка Firebase
     */
    configureFirebase(config) {
        Object.keys(config).forEach(key => {
            if (config[key]) {
                localStorage.setItem(`firebase-${key}`, config[key]);
            }
        });
        
        // Переинициализируем Firebase с новыми настройками
        if (this.isInitialized) {
            this.init();
        }
        
        console.log('✅ Firebase настроен');
        return true;
    }

    /**
     * Получение конфигурации Firebase
     */
    getFirebaseConfig() {
        return {
            apiKey: this.getApiKey(),
            authDomain: this.getAuthDomain(),
            projectId: this.getProjectId(),
            storageBucket: this.getStorageBucket(),
            messagingSenderId: this.getMessagingSenderId(),
            appId: this.getAppId()
        };
    }

    /**
     * Проверка готовности сервиса
     */
    isReady() {
        return this.isInitialized && !!this.db && !!this.auth;
    }

    /**
     * Получение статистики
     */
    async getStatistics() {
        try {
            if (!this.currentUser) {
                return null;
            }

            const userData = await this.getUserData();
            const chatList = await this.getChatList();
            
            return {
                userId: this.currentUser.uid,
                email: this.currentUser.email,
                createdAt: userData?.createdAt,
                lastActivity: userData?.updatedAt,
                totalChats: chatList.length,
                totalMessages: chatList.reduce((sum, chat) => sum + (chat.messageCount || 0), 0),
                settings: userData?.settings || {}
            };
        } catch (error) {
            console.error('❌ Ошибка получения статистики:', error);
            return null;
        }
    }
} 