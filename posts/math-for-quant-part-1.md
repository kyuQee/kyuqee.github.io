---
title: "Beyond High School Probability: Unlocking Binomial, Gaussian, and More"
date: 2025-05-17
slug: math-for-quant-part-1
tags: [maths, blog, quant]
---

# WORK IN PROGRESS


# Introduction

High school curricula typically introduce basic probability concepts; however, probability theory applied in financial mathematics and statistics requires significantly advanced techniques. To enhance my understanding and proficiency, I will undertake an in-depth exploration of probability theory, encompassing distributions such as binomial, Gaussian, and Poisson, as well as concepts including random variables, sigma algebras, and probability spaces.


## The Paradox

Let's start with a question that seems pretty simple, but is deceptively paradoxical with the math taught in high school.   

According to [Wikipedia](https://en.wikipedia.org/wiki/Bertrand_paradox_(probability)) it may be formulated as follows: 
> "Consider an equilateral triangle that is inscribed in a circle. Suppose a chord of the circle is chosen at random. What is the probability that the chord is longer than a side of the triangle?"

This formulation makes it seem like quite an abstract question,   

So we may present it alternatively as: 
> Consider two concentric circles with `A` and `B` with radius `R` and `2R`. Given a chord of the circle `B` is picked at random, find the probability that this chord intersects, the inner circle `A`.

<br>

<img src="/static/images/mathforquant/math-for-quant-part-1-1.svg" style="height: 300px !important" class="invertible">

<br>

This reformulation may model practical scenarios, such as piercing a padded sphere to assess whether it impacts an inner core, though this is merely a contextual preference and does not alter the mathematical problem.

Now typically there are **Three methods** of tackling this problem. 

### Method 1: Random Midpoint Method

This is the method that occurred to me, when I tried to solve this problem. 

If one plays around with the problem long enough, drawing multiple sketches, we might notice this&mdash;

<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-2.svg" style="height: 300px !important"  class="invertible">
<br>

The **midpoints** of all chords that intersect the inner circle, **must lie inside the inner circle**.  

Since any chord $ AB $ of the outer circle that intersects the inner circle must have its perpendicular distance $ d \leq R $, its midpoint $ M $ (at distance $ d $ from $ O $) must lie within or on the inner circle.

Now one can definitely prove this rigorously (and it is a trivial geometric proof), but for our case, let's just say it is true, visually.

Now if we take only the mid points into consideration, and define a coordinate system with the origin at the centre of $ A , B $, we get a sample space that looks like this&mdash;

<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-3.svg" style="height: 300px !important"  class="invertible">
<br>

And if we draw our required event on it, we get&mdash;

<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-4.svg" style="height: 300px !important"  class="invertible">
<br>

So for some formal definitions&mdash;   
$$
\begin{aligned}
\Omega &\in (-2R, 2R) \times (-2R, 2R) \newline
\mathbb{E} &\in (-R, R) \times (-R, R)
\end{aligned}
$$


Which essentially means&mdash;   
$$
\begin{aligned}
\Omega &= \\{(X, Y) \in \mathbb{R}^2 \mid X \in (-2R, 2R), Y \in (-2R, 2R)\\} \newline
\mathbb{E} &= \\{(X, Y) \in \mathbb{R}^2 \mid X \in (-R, R), Y \in (-R, R)\\}
\end{aligned}
$$



Now, to calculate $ P(\mathbb{E}) $ we can simply do&mdash; 

$$ 
P(\mathbb{E}) = \frac{\pi(R)^2}{\pi(2R)^2} = \frac{1}{4}
$$

So our $ P(\mathbb{E}) $ is &mdash;

$$
P(\mathbb{E}) = \boxed{\frac{1}{4}}
$$


### Method 2: Diameter Method

We may also try a more methodical way&mdash;

We first pick a point on the circumference of $ B $, say $ P $,  then we draw a **diameter** passing through the center. Now we may vary this line, by an angle $ \theta $ and get all possible chords that pass through the point $ P $. Similarly we may do this for every point on the circumference of $ B $. 

here is what it looks like&mdash;


<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-5.svg" style="height: 300px !important"  class="invertible">
<br>

here is the visualization of $ \Omega $ and $ \mathbb{E} $ (NOTE: here X is the distance along the circumference of B)

<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-6.svg" style="height: 300px !important"  class="invertible">
<br>


Why $ \frac{\pi}{6} $?  
We can clearly see that a right angled triangle is formed when the chord just touches the inner circle (it is tangent). The hypotenuse is $ 2R $ and the base is $ R $. So we may do $ \cos(\theta) = \frac{R}{2R} $ and then inverse it to get $ \theta = \frac{\pi}{6}$.  

Formally&mdash;
$$
\begin{aligned}
\Omega &= \\{(X, \theta) \in \mathbb{R}^2 \mid X \in (-2\pi R, 2\pi R), \theta \in (0, \pi/2)\\} \newline
\mathbb{E} &= \\{(X, \theta) \in \mathbb{R}^2 \mid X \in (-2\pi R, 2\pi R), \theta \in (0, \pi/6)\\}
\end{aligned}
$$

Or&mdash;
$$
\begin{aligned}
\Omega &= (-2\pi R, 2\pi R) \times (0, \pi/2) \newline
\mathbb{E} &= (-2\pi R, 2\pi R) \times (0, \pi/6)
\end{aligned}
$$


We can now calculate the probability, like&mdash;
$$
\begin{aligned}
P(\mathbb{E}) &= \frac{4\pi R \cdot (\pi/6)}{4\pi R \cdot (\pi/2)} = \frac{1}{3} \newline
P(\mathbb{E}) &= \boxed{\frac{1}{3}}
\end{aligned}
$$

### Method 3: Radius Method 

Take a chord passing through the center at an elevation $ \theta $ from the horizontal. Now we may consider all parallel chords to the diameter, at that elevation, their perpedicular distance from the center being $ x $. We get&mdash;

<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-7.svg" style="height: 300px !important"  class="invertible">
<br>

and the visualization&mdash;
<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-8.svg" style="height: 300px !important"  class="invertible">
<br>

The rest of it is elementary, and $ P(\mathbb{E}) $ comes out to&mdash;
$$
P(\mathbb{E}) = \boxed{\frac{1}{2}}
$$

### The Contradiction 

So, we have **Three answers**. This is clearly a contradiction. It means somewhere along the way, our approach with **highschool math** was **flawed**. To correct this we would need an even deeper understanding of probability theory, beyond the typical highschool math.   
In reality it is the question that may be misunderstood, the right interpretation is crucial to finding the solution to this paradox.   
To know the real in-depth reason you can check out the [Wikipedia Page](https://en.wikipedia.org/wiki/Bertrand_paradox_(probability))   
(HINT: the answer is $ \frac{1}{2} $)


# Terms and Definitions 

Understanding the terms and notation is the most crucial part to understanding probability. 

Let's try to intuitively find out what are the terms required to make a reasonable comment on the probability of an event.  

## What is Probability? 

One could call it the **likelihood or chance**, of a certain event happening. (not to be confused with plausibility)    

What information would we need to comment on such a matter? Usually we would need to know what it is, whose outcome we are trying to determine&mdash; Is it a coin flip? a horse race? a cricket match?&mdash; This is is called the **Random Experiment (RE)**.    

Say we want to determine the probability that a grain of sand ends up exactly on top of a treasure chest, on a beach, after being washed away. Obviously we cannot make any reasonably accurate prediction of such an event. Why is that so? It is because we **do not know** the set of **all possible outcomes** of our random experiment (RE). So to make an accurate comment on the probability of an event, we must also know the set of all possible outcomes of our RE. This set is called the **Sample Space** ($ \Omega $)

## Sample Space 

Now the sample space space could be something like&mdash;

$$
\Omega = \\{Heads, Tails\\}
$$

for a coin flip to something like&mdash;

$$
\Omega = \\{1,2,3,4,5,6 \\}
$$

for a dice roll.    

It may also be something complex like&mdash;

$$
\Omega = \\{(x,y) \in \mathbb{R}^2 \mid 0 \leq x \leq 1, 0 \leq y \leq 1\\}
$$

i.e any random point on a unit square. Even more complex &mdash;

$$
\Omega = \\{(x,y) \in \mathbb{R}^2 \mid 0.25 \leq x^2 + y^2 \leq 1\\}
$$

i.e any random point on a unit disc, that is atleast 0.5 units away from the center. It could also be visualized as a ring. 

Finally, can you guess what this represents &mdash;

$$
\Omega = \\{(x,y,z) \in \mathbb{R}^3 \mid x^2 + y^2 + z^2 = 1, z \geq 0, \sqrt{x^2 + y^2 + (z-1)^2} \leq 1\\}
$$

Kind of scary isn't it?
( HINT: it's a sphere, with a special condition.)   

This should give an idea as to _why_ we need a formal notation for something so intuitive. As we will see later, the theory builds on this and becomes powerful enough to over-take the intuitive approach.


## Sigma Algebra

Typically this is part of **measure theory**, so we'll only cover what we absolutely need to know.

Again [Wikipedia](https://en.wikipedia.org/wiki/%CE%A3-algebra) says:
> In formal terms, a $\sigma$-algebra on a set $ X $ is a nonempty collection $ \Sigma $ of subsets of $ X $ closed under complement, countable unions, and countable intersections. The ordered pair ( $ X $, $ \Sigma $) is called a measurable space.

Too Complicated, Didn't Understand (TC;DU)

Let's start with the simple problem of trying to have complete knowledge of all events that can possibly occur. How do we find this? simple its just all possible subsets of our sample space $ \Omega $&mdash; But can we assign probabilities to **all** of these events? 

In some cases, no, we can't.


To put it simply think of something like this&mdash;

we have $ \Omega = [0,1] $, now if we say that we want an event ($ E $) where the **length of the interval is 0.5**.    
How many such subsets do you think there are? infinite. It could be $ [0.2, 0.7] $, $ [0.3, 0.8] $, and so on.  

Now whats $ P(E)_{[0.2 , 0.7]} $? 
Common sense would say its **0.5** since it covers exactly half of the sample space. But this is where intuition breaks down, for example let's try the **vitali set**&mdash;

(NOTE: In hindsight, the exploration coming up wasn't necessary, you may skip it if you like.)

<br>
<hr>
<br>

### Vitali Set

Suppose we organize the numbers $(x,y)$ from $[0,1]$ into groups based on a set condition, i.e, $ x - y \in \mathbb{Q} $, the difference must be rational. So we could have $0.7 - 0.2 = 0.5$, in the same group, and $0.8 - 0.3 = 0.5$ in the same group.  
This splits $[0,1]$ into a **uncountably many groups**, for instance, one group might include $0.2, 0.7, 0.2 + 1/3, 0.7 + 1/3,$ and so on, as long as the differences are rational. 

Suppose, we pick *exactly one* number from each group to create a set $ V $, called the Vitali set. The rule is that the numbers we pick must not differ by a rational number, because if they did (like 0.2 and 0.7), they'd be in the same group, and we're only allowed one number per group. So something like $ 0.2 $, and $ 1/\sqrt{2} $ etc. This is tricky because there are uncountably many groups, and we rely on the axiom of choice to ensure we can pick one number from each.    


So, we've got our Vitali set $ V $, a collection of numbers, one from each group, where no two numbers differ by a rational. Why does this cause trouble? Let's try to assign it a probability $ P(V) = a $. To check if this works, we shift $ V $ by all rational numbers in $ [0, 1] $, like 0, 0.1, 0.2, 0.3, and so on. For each rational $ q $, the set $ V + q $ (where we add $ q $ to each number in $ V $, wrapping around to stay in $ [0, 1] $) is a shifted copy of $ V $. These shifted sets are **disjoint**&mdash;they don't overlap. Why? If some number appeared in both $ V + q_1 $ and $ V + q_2 $, say $ x + q_1 = y + q_2 $, then $ x - y = q_2 - q_1 $, a rational number, which would mean $ x $ and $ y $ are in the same group, contradicting the fact that $ V $ has only one number per group.

The union of all these shifted sets $ V + q $, over all rational $ q \in [0, 1] $, covers all of $ [0, 1] $. Why? Every number in $ [0, 1] $ belongs to some group, and by shifting $ V $'s representative from each group by all possible rational numbers, we hit every number in every group. Since $ P([0, 1]) = 1 $, the probability of this union should be 1. By our probability rule of countable additivity, the probability of the union is the sum of the probabilities of these disjoint sets:

$$ P\left( \bigcup_{q} (V + q) \right) = \sum_{q} P(V + q) $$

Since shifting by a rational doesn't change the "size" of the set (in a uniform measure), each $ V + q $ should have the same probability as $ V $, so $ P(V + q) = a $. There are countably many rational numbers in $ [0, 1] $, so the sum is:

$$ \sum_{q} P(V + q) = \sum_{q} a $$

Now, we're stuck:

- If $ a > 0 $, the sum $ a + a + \dots $ over countably many terms is infinite, which can't equal 1. That's a contradiction.
- If $ a = 0 $, the sum is 0, which also can't equal 1. Another contradiction.

This shows we *can't* assign a probability to $ V $ without breaking our probability rules. The Vitali set is **non-measurable**-it's too strange to fit into our probability framework. This is why we can't assign probabilities to *every* subset of $ \Omega = [0, 1] $. We need a **sigma algebra** to limit ourselves to subsets that play nice.
<br>
<hr>
<br>
A sigma algebra $ \mathcal{F} $ is our curated list of "good" subsets-events we can assign probabilities to consistently. It follows three rules:

1. **The whole space is included**: $ \Omega \in \mathcal{F} $. We need to say "something happens" with probability 1.
2. **Closed under complements**: If $ A \in \mathcal{F} $, then $ \Omega \setminus A \in \mathcal{F} $ ($\Omega$ - $\mathcal{F}$). If "the number is in $ [0.2, 0.7] $" is an event, "the number is *not* in $ [0.2, 0.7] $" (i.e., $ [0, 0.2) \cup (0.7, 1] $) is too.
3. **Closed under countable unions**: If $ A_1, A_2, \dots \in \mathcal{F} $, then $ \bigcup_{i=1}^\infty A_i \in \mathcal{F} $. This lets us combine events like $ [0.1, 0.2] \cup [0.3, 0.4] $.

For $ \Omega = [0, 1] $, a sigma algebra includes nice subsets like intervals, their unions, and complements, but leaves out non-measurable sets like the Vitali set.

But for our intents and purposes, one may think of this as a **power set**, for simplicity.


## The Borel Sigma Algebra

**TL:DR** It's just a sigma algebra but open intervals.

So, what's a **Borel sigma algebra**? It's the standard sigma algebra for continuous spaces like $ [0, 1] $, $ \mathbb{R} $, or $ \mathbb{R}^2 $, used in problems like the Bertrand paradox. Think of it as the ultimate collection of measurable subsets that makes probability calculations safe and practical.

The Borel sigma algebra, denoted $ \mathcal{B} $, starts with all **open sets** in your space. In $ \Omega = [0, 1] $, open sets are intervals like $ (0.2, 0.5) $ (not including endpoints). In $ \mathbb{R}^2 $, they're open disks, rectangles, or shapes with smooth boundaries. The Borel sigma algebra is the smallest sigma algebra that contains all these open sets, built by:

1. Including all open sets.
2. Adding their complements (closed sets, like $ [0.2, 0.5] $).
3. Adding all countable unions and intersections of these sets.

This creates a huge collection of measurable sets, including:

- Intervals: $ [0.2, 0.5] $, $ (0, 1) $, or single points like $ \{0.42\} $.
- Unions of intervals: $ [0.1, 0.3] \cup [0.5, 0.7] $.

## Probability Measures and Probability Spaces

### Probability Measures
So we laid down most of the formal stuff, now to actually define our **Probability measure**, we may take a function&mdash;

$$
P: \mathcal{F} \to [0,1]
$$

From domain = $\mathcal{F}$, to codomain/range = $[0,1]$.   
It must satisfy:    

1. $P(\Omega) = 1$  
2. $P(\phi) = 0$
3. **Countable additivity**: For a countable collection of **disjoint** sets, $A_1, A_2, \dots \in \mathcal{F}$, $$  P(\bigcup_{i=1}^\infty A_i) = \Sigma_{i=1}^\infty P(A_i) $$

If all of this seems obvious, good. But in most cases it would be advisable to think of continuous probability as different from discrete probability.

### Probability Spaces

So from the terms we defined above, now we can finally define our "world", a probability space. Let's simply package all the relevant stuff into a triple of $(\Omega, \mathcal{F}, P)$.    

For example, for a (single) fair coin flip&mdash;

$$
\begin{aligned}
\Omega &= \\{H, T\\} \newline
\mathcal{F} &= \\{\phi, \\{H\\}, \\{T\\}, \\{H, T\\}\\} \newline
P&(\\{H\\}) = 0.5 , P({\\{T\\}}) = 0.5
\end{aligned}
$$

## Random Variables

So we have a sample space, but doing calculations on it could be quite difficult, especially because we don't really have any set **ordering**. We typically want something in terms of **numbers** to do anything practical with it. So we introduce the **Random Variable (RV)**, that solve this problem.

Contrary to the name, a Random Variable is actually a **function**&mdash;   
$$
X: \Omega \to \mathbb{R}
$$

It assigns a Real Number to every outcome in the sample space.

[TODO]
