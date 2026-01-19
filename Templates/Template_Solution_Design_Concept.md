# Solution Design Concept

This template describes the structure of a solution design concept. The solution design concept describes the overall solution from the client's perspective.

## Vision
The vision describes the desired change that the digital solution shall achieve for the client. 
## Value Proposition
The value proposition describes the customer segments and the value that the solution will deliver to the customer. A solution may have more than one customer segment. In this case, a value proposition shall be created for each customer segment.
## Value Creation Architecture
The value creation architecture describes the structure of the solution that is necessary to deliver the value proposition to the customers. The value creation architecture may include the following elements:
- Customers that receive the value
- Organisations that are part of the value creation. This can be the client's organization or other organisations that are necessary for delivering the value (e.g. a payment provider for organizing payment or a logistics provider for sending parcels for an online-shop). A organization can be represented by a person or by a digital element
- Digital elements that are necessary for delivering the value (e.g., a smartphone app as interface to the customer or a web portal as interface for customer support)
## Information Architecture
The information architecture describes all the information structure of the digital solution in terms of business entities. A business entity captures all a number attributes that are relevant for achieving the value proposition and for performing the business processes.
### Sample Business Entity
The business entity customer data captures all relevant information of a customer including his name, adress and birthday. 
## Business Processes
This section describes the main business processes that are necessary for delivering the value.
For each business process, a seperate level 2 heading shall be created. The business processes shall focus on the essential aspects of the value creation and shall ignore technical details (e.g. exceptions)
Below is a sample process.
### Sampe Business Process
A business process shall be describes in form of a scenario with steps. Each step shall mention a concrete action in the business process and shall refer to elements of the value creation architecture (see above)
## Quality Requirements
This section shall list important quality requirements (also known as non-functional requirements) of the overall solution. The quality requirements shall focus on the overall solution and shall not refer to technical aspects of the technical system. 
## Constraints
This section shall list important constraints for the solution. Constraints may include legal constraints (e.g. GPDR) or organizational constraints.