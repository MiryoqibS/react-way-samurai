const persons = [
    { name: "dmitry", age: 37 },
    { name: "john", age: 17 },
    { name: "rita", age: 18 },
];

// filter
const adults = persons.filter(predicateForAdults);
const children = persons.filter(predicateForChildren);

function predicateForAdults(person, index, array) {
    return person.age >= 18;
};

function predicateForChildren(person, index, array) {
    return person.age < 18;
};

console.log(adults);
console.log(children);

// find
const adult = persons.find(person => person.age >= 18)

console.log(adult);

