# Shape generator

Test it here -> https://7verr.csb.app/

In this web application, you can draw shape using defined rules.

## Genetic algorithm

With "AI" button, you can draw random shape with genetic algotithm.

### Algorithm steps:

1. Initial population - generate random shapes using defined rules
2. Natural selection - rate shapes from initial population and remove 1/4 with worst marks
3. Crossover - divide shapes into pairs and add parts of them to each other
4. Mutation - shapes after crossover are mutated with random intensity. Mutation changes some parts of shape
5. New genration - after mutation new generation of shapes is created. They are rated and the best of them is displayed to user.

## Important facts:

- Application allows to make shapes using defined 5 rules. However we can not use them randomly (e.g. we can not use rule that make a line in different direction just after square, we have to change square to line first)

- After generating random shape, we can continue drawing with other buttons

- Shape is represented as a list of rules (we have 5 defined rules)

- If generated shape(in genetic algorithm) leaves canvas borders, shape is cut from rule that left the border, so mutation or crossover can significantly shorten the shape

- To fasten visual changes, every click on "AI" button passes 5 generations

