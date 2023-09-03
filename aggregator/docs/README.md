# Github aggregator

```
@startuml
skinparam actorStyle awesome
actor Person as Developer
"Pull workflow data" as (pull_workflow)
"Pull job data" as (pull_job)
"Plot job aggregated duration" as (plot)
"Defines the configuration" as (defines_configuration)

Developer --> defines_configuration
Developer -> pull_workflow
Developer --> pull_job
Developer --> plot

pull_workflow ..> defines_configuration
pull_workflow ..> defines_configuration
pull_job ..> pull_workflow

plot ..> pull_workflow
plot ..> pull_job
@enduml
```


```
@startuml
actor         Developer
participant   Application
participant   WorkflowRun
participant   WorkflowRepository
boundary      GithubClient as "Github Client"
database      FileSystem as "FileSystem"

Developer -> Application
Application -> WorkflowRun

alt successful case 
    loop until last page
        WorkflowRun -> WorkflowRepository
    
        WorkflowRepository -> GithubClient: calls with token
        GithubClient -> WorkflowRepository: data from workflow (paginated)
        WorkflowRepository -> FileSystem
        FileSystem -> WorkflowRepository
    
        WorkflowRepository -> WorkflowRun
    end
end

WorkflowRun -> Application
Application -> Developer
@enduml
```
