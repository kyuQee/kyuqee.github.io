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

Now one can definitely prove this rigourously (and it is a trivial geometric proof), but for our case, let's just say it is true, visually.

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
