---
title: "Beyond High School Probability: Unlocking Binomial, Gaussian, and More"
date: 2025-05-15
slug: math-for-quant-part-1
tags: [maths, blog, quant]
---

# Introduction

Typically we are taught basic probability in high school, but real probability theory using in financial math, and statistics differs greatly from the concepts taught back in high school. So as a way to learn and brush up my skills I am going to explore probability theory in depth.


## The Paradox

Let's start with a question, that seems pretty simple, but is deceptively paradoxical with the math taught in high school.   

According to wikipedia it may be formulated as follows: 
> "Consider an equilateral triangle that is inscribed in a circle. Suppose a chord of the circle is chosen at random. What is the probability that the chord is longer than a side of the triangle?"

I don't really like the way it is formulated here and it makes it seem like quite an abstract question,   

So we may present it alternatively as: 
> Consider two concentric circles with `A` and `B` with radius `R` and `2R`. Given a chord of the circle `B` is picked at random, find the probability that this chord intersects, the inner circle `A`.

<br>

<img src="/static/images/mathforquant/math-for-quant-part-1-1.svg" style="height: 300px !important" class="invertible">

<br>

Now this may be a simplification of some real world problem, say like piercing a padded ball and predicting if it will burst the bladder, or shooting a bullet through a water melon etc. This is however simply personal preference and has no impact on the actual question/problem at hand.

Now typically there are **Three methods** of tackling this problem. 

### Method 1: Random Midpoint Method

This is the method that occurred to me, when I tried to solve this problem. 

If one plays around with the problem long enough, drawing multiple sketches, we might notice this

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

Now, to calculate $ P(E) $ we can simply do&mdash; 

$$ 
P(E) = \frac{\pi(R)^2}{\pi(2R)^2} = \frac{1}{4}
$$

So our $ P(E) $ is &mdash;

$$
P(E) = \boxed{\frac{1}{4}}
$$


### Method 2: Diameter Method

We may also try a more methodical way&mdash;

We first pick a point on the circumference of $ B $, say $ P $,  then we draw a **diameter** passing through the center. Now we may vary this line, by an angle $ \theta $ and get all possible chords that pass through the point $ P $. Similarly we may do this for every point on the circumference of $ B $. 

here is what it looks like&mdash;


<br>
<img src="/static/images/mathforquant/math-for-quant-part-1-5.svg" style="height: 300px !important"  class="invertible">
<br>

