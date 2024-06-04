const mongoose = require("mongoose");

console.log(process.argv.length, process.argv.slice(2));

if (!(2 < process.argv.length <= 5)) {
  console.log("give password argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://drortomer9:${password}@fullstackpart3.ysl57l1.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
    process.exit(1);
  });
} else {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log(
      `added ${process.argv[3]} nubmer ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
}
