document.getElementById('format').addEventListener('click', function() {
    const input = document.getElementById('input').value;
    try {
        const obj = JSON.parse(input);
        document.getElementById('output').value = JSON.stringify(obj, null, 2);
    } catch (e) {
        document.getElementById('output').value = '错误：无效的JSON格式\n' + e.message;
    }
});

document.getElementById('compress').addEventListener('click', function() {
    const input = document.getElementById('input').value;
    try {
        const obj = JSON.parse(input);
        document.getElementById('output').value = JSON.stringify(obj);
    } catch (e) {
        document.getElementById('output').value = '错误：无效的JSON格式\n' + e.message;
    }
});

document.getElementById('clear').addEventListener('click', function() {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
}); 