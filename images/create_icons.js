// 创建16x16图标
const icon16 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAC5SURBVDiNrdMxSgNBFMbx34QUglewEqwEC8HWG3gAS0FIYWfvGbyCjWBlyAG8gI2QA1h4AA9gk8K4zKywLDs7O/vBwDzm+7/33puJiMhMxQQnOMAVnnCPm9TLJSLGEXEbvzNPvTyMiBgV8IY1nOIcH1jBFT7xjdPUy1VExBZusYktnOMZO9jFE/bxhfPUy3lExDoucYQZHvGODexhhk3MU+/7TyLiFGvYxwIzfGCKB7zjLvXeyn/yA0ukQ1DZxNLHAAAAAElFTkSuQmCC';

// 创建48x48图标
const icon48 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHMSURBVGiB7Zg9TsNAEIXfOkIIKkpKJCSKSBR0VJR0kRBHoKbkKJyBA0BByxE4ABUgCgQSv4YiJLLWs7P2xjEFX2nJ3s17M7Oxx7tGkiQBSQzFaOgEQhk9YNWJjR4gIh4AXAI4BXAMYKbNvwN4BXAPYCkiL9YASZIkWuvtnJn3mLnOyF0z8x4z12Z+6+3cGk9rv0xr/QjgBMALgGsAD865n96EiMwBXAA4AnCitR4rpRYmkXPuG8AKwIb3wMwb59y3SWQhImMAYwBrrXVmvPrJzKKUWpjzaq0/ReQewA6AmaV4Zp4BWGmtP80B+gl4YwC7zrnPrITMPAewq5T6yIpn5gMACwC5AoBFXjwzHwJY5sYrpd4BLAE0eQUwc1MULyKvRQUAQFG8iLwVxv8lIm8A1kUFEFEjIq+WeCJqAKyLCvDOPQF4zDwBEXkuKaA0/t8XkCfvnNuIyDOAgyEE5N6BvwgB8CQir0MJyBSQWkDe3+i9iDwNIcB7AhHxzr0DeBoqPvUESqlGRFZ58UMWkCkgtYAJgKY0fhIRWQKYlcYnF5D6Tyw1qZ9CqdGfQqkZPUDqJ1BqOhUQEb8AEhG/jR7wC+OZnpjpQGc/AAAAAElFTkSuQmCC';

// 创建128x128图标
const icon128 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAADsQAAA7EB9YPtSQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAQ8SURBVHic7d3Pa1V1HMfx1/fcuddR6h2NcYcgwahwDxzRwoJMemmLIDQIIoKgH7QKDKJfq/6CdtGiQAqCzIJoYWQQFQiltjCwH0OdUeqYc+rOvfd8WkS0mPece8895/s95/t5wWE4Z+d8Pu/v537PPef7/X4VEZEQUQnQAewFeoHtwFagHWgD5oEbwDXgCnAJGAMuAjNF5xw1gQqwH/gQmATqTW7jwOfAC0ClqP8kKgIV4BAwSmNFb7RdBg4D1aL+s7ALvAKcpfWiN9rOAQeL+i/DKrAXGCJ70Rtto8DzRf3HYbITOE1+RW+0nQF2FJVAGGwGzpN/4RfbMHBfUYmEWRvwHcUVfrFdBNYVlVBYvUPxhV9s7xaVVBjtpvnr+7y2OWBXUcmFSRtwlXIUf7FdA9qLSjJMXqc8hV9sbxSVZJi0AddxX/RxYLiJdgOYbqL9BPzq+PgTQEdRyYbFQdwXaBh4ElgNrAEOAOebjF0P9LhMEHgKt8W5BDzW4Bi7gJ+bjL+/qITD4CJui/Jug2PUgKtNHutiUUmHwQxui/LjMse51ORxZotK2ndVYBy3BdkKzC1zrF+aPF5PUYn7bi9ui9EHrF3mWJuAv5o83t6iEvfdO7gvyHsrHO9Yi8d8u6jEfdaB22v/aWB9E8fcBPzZ4nE7i0reZ0/ithBngbVNHncrMNLicZ8oKnmfvYb7QrzX4rHfz+DYrxaVvK8qwB+4LcIU0N3i8buAP1o8/gRQLSoJX23DbQF+ANZkcI7V/HfPIK1zPVBUEr46jNvi9wMrMzrPgxmc6xBqtFnWBG4LfzyjczXz1HGj7TpqtFnWLtwW/TywKsPz3Z/B+XYXlYiPPsB9wQ9lfM7DMTjnB0Ul4psq+V+nzwMPZXzebcBUBuetEZEbjluAx3Fb6B+BVTmcc3WG594KbMnhvF7rx33BsxoEWmzHMjz3kZzO7a2zuC/2OPlN5+rM6PxngHoO5/fWDO4LfSKnc5/M6PwzOZ3fW2XYv38O2JzDeTcDf2d0jlL8nPVdGQowADyc8TkfAQYzPEfhfFeGAnyW8fk+z/gcaiKVXIB2YDzD842R7+0krwvgu0FgXUbn6gS+zOhcaiLVXID3MzrPBxmfR02kmgvQDoxlcI4xoJrxedREqrkAe2j9Gn078EIGOVATKRQA4H1gZQvxq4DPMspBTaRQgA7guxbiTwOrM8pBTaRQAIBngWspxl0HnssyATWXUgEAPgHWpxC3Afgqh+OrydRvAhfbKuAUcF8TMS3fBFKTqRQAoAv4mmXm+nUBp4GuHI+tJlMrANyZD/A4cBp4kP/fGt4InAGeIP/5AGoypQLAnYGhPcBzwJPANu68QzAH3OSf9wYuA98DF4B6QTmqyRQLICWlAogKICqAqACiAogKICqAqACiAogKICqAqACiAogKICqAqACiAogKICqAqAARcRv4G41PFH8xgYDfAAAAAElFTkSuQmCC';

// 将base64转换为文件
function base64ToFile(base64Data, filename) {
    const byteString = atob(base64Data.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: 'image/png' });
    const file = new File([blob], filename, { type: 'image/png' });
    return file;
}

// 创建图标文件
const icon16File = base64ToFile(icon16, 'icon16.png');
const icon48File = base64ToFile(icon48, 'icon48.png');
const icon128File = base64ToFile(icon128, 'icon128.png'); 