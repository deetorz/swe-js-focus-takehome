## My understanding of the task
There were three cypress tests failing and I needed to figure out why. This would involve potentially fixing problems with hydration, SSR, client side rendering, and data fetching.

## My process
When I first received the take home, the first test was already passing. However, after reaching out to Daniel and then pulling again, the test was failing as expected. At this point
I was extremely lost. I had looked through many files, looked up some docs, and prompted ChatGPT but to no avail. I still had access to the code from before, when the test was passing,
and took a look to point me in the right direction. I found that a random number was being generated for an id, so the client and server had different ids, resulting in failed hydration.
I was disappointed for not exactly figuring it out on my own but tried to not be too hard on myself and used it as a learning experience. After digging around more and trying to understand 
what was really going on, I moved on to the next issue, which was simply a reference issue. I think it might have been easier to import the whole controller, but I like the look of importing 
just what is needed.

For the second test, I needed to fix an issue with an incorrect object key in the generated client file. After adding the extra paths in the spec file, that issue was cleared. However, 
the shop title was now incorrect. I did some digging around and, with the help of the title element in the HTML head, I was able to find the slug buried in the request being sent to the api.
I am not sure if this is correct, but that was the only way I could think of to get the correct value. I had also noticed that the in the test file, sometimes draft was expected to be an 
object and sometimes an array. So I refactored the custom 'mock' cypress command so that an arrow function returning an array or object would be passed as the 'producer' parameter. Before this, 
logging the store would return a shop, but no menu. However, after the change, both were returned (though the menu had random values seemingly added by OpenAPI.) At this point, the second test 
was only giving me issues with missing HTML, whereas the third test was giving me an error in relation to Immer. I am not sure if this was an issue with the test itself, but from what I researched 
and understood, Immer does not allow splicing an array, so it was throwing that error. I believe that because of this, the test was not able to complete, so Immer was using random values for 
the menu items. I am stil not 100% sure about this, but I believe this to be the case because when I first run the application, the correct data is logged. However, after running the cypress tests 
even once, the data is then changed and is replaced with random values.

That brings me to now. I am not sure how to proceed and have found myself to be pretty much hard stuck.

## Problems faced
As mentioned in the previous section, the main problem that made me stop where I did was confusion with the tests trying to splice arrays when Immer does not allow that (as far as I know) and
the data being replaced with random values and not knowing completely why.

Aside from that, the main problem for me was that I was completely out of my element. I am not familiar with React, SSR, hydration, and a few of the other libraries used in this take home. It
was a rollercoaster of emotions going through the test. Frustrated I could not solve something, feel like a king when I did.. If nothing else, I am glad to have learned some new things with this.

## What is missing/remaining
Mainly the second task. Because I was not sure how to get around the last issue I was facing, I was not confident I could proceed. If it were possible to get around that Immer error and get all 
the data I needed, I believe I could have started working on the UI part of the test (the modal.) That being said, after submitting this, I will work on the UI, using my own shop and menu dummy 
data and try to render the components based off of that. If I am invited to have a code review, I hope to have the UI done by then.

Thank you for the opportunity to interview with TableCheck and the chance to learn some new things with this take home. While it was hard for me, I ultimately enjoyed it very much.
