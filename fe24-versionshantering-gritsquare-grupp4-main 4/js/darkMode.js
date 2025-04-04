document.addEventListener('DOMContentLoaded', function () {
  const toggleTheme = document.getElementById('toggleTheme');
  toggleTheme.addEventListener('click', toggleThemeHandler);

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
});

function toggleThemeHandler() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}
