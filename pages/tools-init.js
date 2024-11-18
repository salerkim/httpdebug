// 添加按钮事件监听
document.addEventListener('DOMContentLoaded', function() {
    // Base64 按钮
    document.getElementById('base64EncodeBtn').addEventListener('click', base64Encode);
    document.getElementById('base64DecodeBtn').addEventListener('click', base64Decode);
    document.getElementById('base64ClearBtn').addEventListener('click', clearBase64);

    // URL 按钮
    document.getElementById('urlEncodeBtn').addEventListener('click', urlEncode);
    document.getElementById('urlDecodeBtn').addEventListener('click', urlDecode);
    document.getElementById('urlClearBtn').addEventListener('click', clearUrl);

    // 时间戳按钮
    document.getElementById('timestamp2DateBtn').addEventListener('click', timestamp2Date);
    document.getElementById('date2TimestampBtn').addEventListener('click', date2Timestamp);
    document.getElementById('getCurrentTimestampBtn').addEventListener('click', getCurrentTimestamp);
    document.getElementById('timestampClearBtn').addEventListener('click', clearTimestamp);

    // MD5 按钮
    document.getElementById('md5EncryptBtn').addEventListener('click', md5Encrypt);
    document.getElementById('md5ClearBtn').addEventListener('click', clearMd5);

    // 添加输入框回车事件
    document.getElementById('base64Input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            base64Encode();
        }
    });

    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            urlEncode();
        }
    });

    document.getElementById('timestampInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            timestamp2Date();
        }
    });

    document.getElementById('md5Input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            md5Encrypt();
        }
    });
}); 