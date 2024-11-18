// Base64 编解码
function base64Encode() {
    const input = document.getElementById('base64Input').value;
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('base64Result').textContent = encoded;
    } catch (e) {
        document.getElementById('base64Result').textContent = '编码失败：' + e.message;
    }
}

function base64Decode() {
    const input = document.getElementById('base64Input').value;
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64Result').textContent = decoded;
    } catch (e) {
        document.getElementById('base64Result').textContent = '解码失败：' + e.message;
    }
}

function clearBase64() {
    document.getElementById('base64Input').value = '';
    document.getElementById('base64Result').textContent = '';
}

// URL 编解码
function urlEncode() {
    const input = document.getElementById('urlInput').value;
    try {
        const encoded = encodeURIComponent(input);
        document.getElementById('urlResult').textContent = encoded;
    } catch (e) {
        document.getElementById('urlResult').textContent = '编码失败：' + e.message;
    }
}

function urlDecode() {
    const input = document.getElementById('urlInput').value;
    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('urlResult').textContent = decoded;
    } catch (e) {
        document.getElementById('urlResult').textContent = '解码失败：' + e.message;
    }
}

function clearUrl() {
    document.getElementById('urlInput').value = '';
    document.getElementById('urlResult').textContent = '';
}

// 时间戳转换
function getTimestampUnit() {
    return document.querySelector('input[name="timestampUnit"]:checked').value;
}

function timestamp2Date() {
    const input = document.getElementById('timestampInput').value.trim();
    if (!input) {
        document.getElementById('timestampResult').textContent = '请输入时间戳';
        return;
    }

    try {
        let timestamp = parseInt(input);
        if (getTimestampUnit() === 'seconds' && timestamp.toString().length === 10) {
            timestamp *= 1000;
        }
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
            throw new Error('无效的时间戳');
        }
        document.getElementById('timestampResult').textContent = date.toLocaleString();
    } catch (e) {
        document.getElementById('timestampResult').textContent = '转换失败：' + e.message;
    }
}

function date2Timestamp() {
    const input = document.getElementById('timestampInput').value.trim();
    if (!input) {
        document.getElementById('timestampResult').textContent = '请输入日期时间';
        return;
    }

    try {
        const date = new Date(input);
        if (isNaN(date.getTime())) {
            throw new Error('无效的日期时间');
        }
        let timestamp = date.getTime();
        if (getTimestampUnit() === 'seconds') {
            timestamp = Math.floor(timestamp / 1000);
        }
        document.getElementById('timestampResult').textContent = timestamp.toString();
    } catch (e) {
        document.getElementById('timestampResult').textContent = '转换失败：' + e.message;
    }
}

function getCurrentTimestamp() {
    const now = new Date();
    let timestamp = now.getTime();
    if (getTimestampUnit() === 'seconds') {
        timestamp = Math.floor(timestamp / 1000);
    }
    document.getElementById('timestampInput').value = timestamp;
    document.getElementById('timestampResult').textContent = now.toLocaleString();
}

function clearTimestamp() {
    document.getElementById('timestampInput').value = '';
    document.getElementById('timestampResult').textContent = '';
}

// MD5 加密
function md5Encrypt() {
    const input = document.getElementById('md5Input').value;
    try {
        const encrypted = md5(input);
        document.getElementById('md5Result').textContent = encrypted;
    } catch (e) {
        document.getElementById('md5Result').textContent = '加密失败：' + e.message;
    }
}

function clearMd5() {
    document.getElementById('md5Input').value = '';
    document.getElementById('md5Result').textContent = '';
}

// 添加回车键触发功能
document.addEventListener('DOMContentLoaded', function() {
    // Base64输入框回车触发编码
    document.getElementById('base64Input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            base64Encode();
        }
    });

    // URL输入框回车触发编码
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            urlEncode();
        }
    });

    // 时间戳输入框回车触发转换
    document.getElementById('timestampInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            timestamp2Date();
        }
    });

    // MD5输入框回车触发加密
    document.getElementById('md5Input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            md5Encrypt();
        }
    });
}); 