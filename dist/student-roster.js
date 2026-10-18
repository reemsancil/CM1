// Registered names supplied by Mrs. Reem. Keep each name stable to retain its results.
window.StudentRoster = (() => {
  const classes = {
  "CM1 A": [
    "Ismail",
    "Katriel",
    "Ahmad",
    "Habiba",
    "Ilyan",
    "Sami",
    "Leyth",
    "Lucia",
    "Iyad",
    "Sacha",
    "Adelaide",
    "Lana",
    "Iyed",
    "Joud",
    "Melina",
    "Sohel",
    "Jean",
    "Lilya",
    "Aziz",
    "Thea",
    "Nour",
    "Sybil",
    "Mohammad",
    "Romy"
  ],
  "CM1 D": [
    "Zoe",
    "Racine",
    "Aram",
    "Sabrina",
    "Jacob",
    "Kinan",
    "Emir",
    "Camille",
    "Zoya",
    "Eva",
    "Richard",
    "Leyth",
    "Natalya",
    "Nathan",
    "Arthur",
    "Lina",
    "Ziad",
    "Shems",
    "Lav",
    "Miral",
    "Elyes",
    "Lea",
    "Badis",
    "Margaux",
    "Tachfine"
  ]
};
  function bind(form, nameField, sectionField) {
    const name = form.elements[nameField], section = form.elements[sectionField];
    const nameLabel = form.querySelector(`label[for="${name.id}"]`);
    const sectionLabel = form.querySelector(`label[for="${section.id}"]`);
    // Present the class first, followed by its registered names.
    form.insertBefore(sectionLabel, nameLabel);
    form.insertBefore(section, nameLabel);
    function refresh() {
      name.setCustomValidity('');
      const names = classes[section.value] || [];
      name.replaceChildren(new Option(names.length ? 'Choose your name' : 'Choose your class first', ''));
      for (const value of [...names].sort((a, b) => a.localeCompare(b, 'en'))) {
        name.add(new Option(value, value));
      }
    }
    section.addEventListener('change', refresh);
    name.addEventListener('change', () => name.setCustomValidity(''));
    form.addEventListener('reset', () => queueMicrotask(refresh));
    form.addEventListener('submit', event => {
      if (!(classes[section.value] || []).includes(name.value)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        name.setCustomValidity('Please choose your class and your registered name.');
        name.reportValidity();
      }
    }, true);
    refresh();
  }
  return { bind };
})();
