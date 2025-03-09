---
title: Comparing differences in depthwise separable and normal convs in pytorch
date: 2025-03-09
slug: comparing-differences-in-depthwise-seperable-and-normal-convolutions-in-pytorch
tags: [python, blog, pytorch, report]
---

#### Disclaimer:   
This is not a scientific paper or report or completely accurate in any way. It is simply a personal diary/note that I have made while trying to learn ML. 


### Abstract:
(PLACEHOLDER)
Convolutional neural networks (CNNs) have witnessed rapid evolution, with computational efficiency emerging as a key design criterion. This study compares standard convolutional operations with depthwise separable convolutions using the PyTorch framework. We derive the theoretical computational costs as follows: for standard convolutions, 
$$
\text{Cost} = K^2 \times C_{\text{in}} \times C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}
$$


and for depthwise separable convolutions, 
$$ 
\text{Cost} = K^2 \times C_{\text{in}} \times H_{\text{out}} \times W_{\text{out}} + C_{\text{in}} \times C_{\text{out}} \times H_{\text{out}} \times W_{\text{out}}
$$  

Using benchmark datasets such as CIFAR-10, our empirical evaluations explore the trade-offs between reduced computational load and potential impacts on model accuracy. Preliminary results indicate that depthwise separable convolutions can significantly lower computational demands with minimal loss in accuracy, offering promising insights for the design of efficient neural architectures in resource-constrained environments.
