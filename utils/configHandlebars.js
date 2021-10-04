import handlebars from "express-handlebars";

const configHandlebars = handlebars({
  extname: "hbs",
  defaultLayout: "layout.hbs",
  helpers: {
    select(selected, options) {
      return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"');
    }
  }
});

export { configHandlebars };