/**
 * Created by rahilvora on 06/04/16.
 */
$(document).ready(function(){
    $("#submitData").click(function(e){
        var professorName = document.getElementById('professor'),
            Assignment = document.getElementById('Assignment'),
            Concept = document.getElementById('Concept'),
            Technology = document.getElementById('Technology'),
            Helpfulness = document.getElementById('Helpfulness'),
            sjsuId = document.getElementById('sjsuid').value,
            professorValue = professorName.options[professorName.selectedIndex].value,
            AssignmentValue = Assignment.options[Assignment.selectedIndex].value,
            ConceptValue = Concept.options[Concept.selectedIndex].value,
            TechnologyValue = Technology.options[Technology.selectedIndex].value,
            HelpfulnessValue = Helpfulness.options[Helpfulness.selectedIndex].value;

        $.ajax({
            url:'/submit',
            data:{"professorValue":professorValue,
                  "AssignmentValue":AssignmentValue,
                  "ConceptValue":ConceptValue,
                  "TechnologyValue":TechnologyValue,
                  "HelpfulnessValue":HelpfulnessValue,
                  "sjsuid":sjsuId
                },
            dataType:"json",
            type:'POST',
            success:function(data) {
                console.log(data);
                //document.getElementById('answer').style.color = 'red';
                document.getElementById('status').innerHTML = data;
            }
        });
        e.preventDefault();
    });
});