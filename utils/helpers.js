const date = require('date-and-time');

module.exports = {
  format_date: (now) => {
    return date.format(now, 'DD MMMM YYYY');
  },
  format_plural: (word, amount) => {
    if (amount !== 1) {
      return `${word}s`;
    }

    return word;
  },
  format_url: (url) => {
    return url
      .replace("http://", "")
      .replace("https://", "")
      .replace("www.", "")
      .split("/")[0]
      .split("?")[0];
  },

  format_rating: (star) => {
    const array = JSON.parse(star);
    return `<i class="rating__star far fa-star"></i>`;
  },
  times: (n, block) => {
    var accum = "";
    for (var i = 0; i < n; ++i) accum += block.fn(i);
    return accum;
  },
  shortened_comment: (comment) => {
    if (comment.length > 30) {
      return `${comment.substr(0, 30)}...`;
    }
    return comment;
  },
};