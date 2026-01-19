# Element Design Concept - Name_of_Element
This template describes the structure of an element design concept. The element design concept describes the non-technical design of an element of a digital solution. An element can for example be a smartphone app, or web app, a server element or even a complicated system.
The element is described in a way that is detailed enough for implementing the element.

## Goals
This section gives a brief textual description of the goals that shall be achieved by the element. 

Create a subheading for each goal and obey the following template
### G - No - Name
Create an ID starting with G following by a dash and a number.  Define a human readable name for the goal.

**Description**
Add a brief textual description of the goal. If possible refer to a higher level goal of the overall system or solution design as a rationale for the goal.
## User Interfaces
This section lists the user interfaces of a particular element. A use interface gives a user access to the functionalities of a system. Create a subheading for each user interface and obey the following template.
### UI - No - Name
Create an ID starting with UI following by a dash and a number.  Define a human readable name for the use interface.

**Description**
Add a brief textual description of the user interface and explain its purpose. Name the particular user type that may use is this user interface.

**Actions**
Describe the available actions that a user can perform on this user interface. For each action, refer to the corresponding use case that describes how the action is performed. 

**Visible Data**
Describe the data that is presented to user in terms of attribes. For each attribute, name the entity or the function that is providing the data.


## Use Cases
This section lists the use cases that the element can perform. A use case represents a functionality provided by an element of a system to a user. Create a subheading for each use case  and obey the following template.

### UC-ID - Name
Create an ID starting with UC following by a dash and a number.  Define a human readable name for the use case.

**Goal**

Create a reference to the goals (ID and Name) that this use case shall achieve.

**Prerequisites**
Add a list of prerequisites for this use case. A prerequisite can be an event or another use case. In case you refer to a another use case as prerequisite, present the name and followed by the ID of the use case

**Actors**
Name the actors that are active in this use case. An actor must be an element of the system architecture from the system design concept. Create a bullet point for each actor, name the actor and add the ID of the actor from the system design concept. 

**Main Scenario**

Decribe the main scenario for this use case. Follow the rules presented below.

**Alternative scenarios**

Describe the alternative scenarios for this use case. Follow the rules presented below.

A use case is described by exactly one main scenario and a number of optional alternative scenarios. A scenario is described by a sequence of steps. You must obey the following rules for defining a step:
1) A step can be one of three things
	1) a user interaction with a user
	2) a technical interaction with another element
	3) an activity of the element
	4) between this element and another element of the system. 	
2) A user interaction requires a user interface. Clearly name the user interface and describe the data that is entered by the user or shown to the user.
3) A technical interaction requires a technical interface to the other element. Clearly name the other element, the technical interface and the data that is sent to or received from the other element.
4) An activity of the element requires a technical function. Clearly name the technical function and describe what the function is doing.
5) In case a step can fail, add an alternative scenario that describes the alternative behaviour. Reference the step and add a letter starting with a. For example, 3a refers to an alternative step for step 3. In case an alternative scenario has more steps, keep the letter for ech additional number. For example, a three step alternative for step 3 is numbered as 3a, 4a, and 5a. 

## Technical Functions
This section lists the technical functions that the element can perform. A technical function represents an internal functionality that an element of a system can perform. 

Create a subheading for each technical function and obey the following template.
### TF - No - Name
Create an ID starting with TF following by a dash and a number.  Define a human readable name for the technical function.
**Input**
Describe the parameters that a required as input for this technical function. 
**Output**
Decribe the output of this function in terms of attrbutes
**Main functional flow**
Decribe the main functional flow of this technical function.
**Alternative functional flows**
Describe the alternative flows for this technical function. Obey the rules presented below.

The template consists of an input section, an output section, a main functional flow, and optional alternative functional flows. The functional flow description consists of steps. You must obey the following rules for defining a technical function:
1) A step can be one of three things
	1) an operation on known data
	2) access to an entity (read or write)
	3) a technical interaction with another element
2) An operation described the manipulation of data. The manipulated data must either come from the input or from an existing entity.
3) 4) A technical interaction requires a technical interface to the other element. Clearly name the other element, the technical interface and the data that is sent to or received from the other element.
4) The functional description must explain how the output is created.
5) In case a step can fail, add an alternative functional flow that describes the alternative behaviour. Reference the step and add a letter starting with a. For example, 3a refers to an alternative step for step 3. In case an alternative scenario has more steps, keep the letter for ech additional number. For example, a three step alternative for step 3 is numbered as 3a, 4a, and 5a.]

## Technical Interfaces
This section lists the technical interfaces that the element can offer.  A technical interface allows an element to access data or technical functions of another element.

Create a subheading for each technical interface  and obey the following template.
### TI - No - Name
Create an ID starting with TI following by a dash and a number.  Define a human readable name for the technical interface.
**Description**
Add a brief textual description of the technical interface and explain its purpose. Name the particular elements that may use is this technical interface and also name the technical interface of the using system.
**Input**
Describe the input that the technical interface expects to operate. Name the concrete parameters and their data type
**Output**
Describe the output that the technical interface provides to the element.
**Action**
Describe the action that the technical interface performs. The action must make clear how the output of the interface is created from the input and a further action. An action can be one of two things:
1) Reading from or writing data to an entity. Name the concrete entity including the ID and the corresponding attributes including their ID. For example, an writes to entity Customer (E-3) and the the attribute purchase with attribute ID 17, name the write as E-3.17.
2) Calling a technical function. Name the technical function including the ID (e.g. TF-17) and name the input and output from the function

## Entities
This section lists the entities that the element stores. An entity represents a set of attributes that describe the information that an element stores.

Create a subheading for each entity and obey the following template.
### E - No - Name
Create an ID starting with E following by a dash and a number.  Define a human readable name for the entity.
**Description**
Add a brief textual description of the entity and explain its purpose

**Attributes**
Describe each attribute of the entity with a unique ID number starting at 1. Give each attribute a name, a data type, and a brief description. The ID of the attribute together with the ID of the entity allows for a unique identification of the attribute in the specification.

| ID  | Name | Data type | Description |
| --- | ---- | --------- | ----------- |
|     |      |           |             |
## Quality Requirements
This section shall list important quality requirements (also known as non-functional requirements) that the element has to achieve. 

Create a subheading for each quality requirement and obey the following template
## QR - No - Name
Create an ID starting with QR following by a dash and a number.  Define a human readable name for the quality requirement.

**Description**
Add a brief textual description of the quality requirement. A quality requirements shall focus on a particular part of the element design concept. This can be a user interface, a use case, a technical function, a technical interface, or an entity. 
## Constraints
This section shall list important constraints for the element. 

Create a subheading for each constraints and obey the following template
## C - No - Name
Create an ID starting with C following by a dash and a number.  Define a human readable name for the constraint.

**Description**
Add a brief textual description of the constraint. Constraints may include legal constraints (e.g. GPDR) or technical constraints (e.g. certain hardware or software).

If possible, at a reference to relevant law or standard where the constraint is defined. 