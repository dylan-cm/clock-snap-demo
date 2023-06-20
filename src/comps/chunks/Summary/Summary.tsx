import React, { useState } from "react";
import "./Summary.css";
import Dropdown from "../../atoms/Dropdown/Dropdown";

interface SummaryProps {}

const Summary = ({ ...props }: SummaryProps) => {
  const [project, setProject] = useState<string>("");
  const [year, setYear] = useState<string>("");
  return (
    <div className="Summary">
      <div className="SummaryControls">
        <Dropdown
          label="Project"
          options={[
            { value: "Las Palmas", color: "hsl(67, 100%, 82%)" },
            { value: "Cal-a-vie", color: "hsl(25, 100%, 82%)" },
          ]}
          selectedOption={project}
          onChange={(v) => setProject(v)}
        />
        <Dropdown
          label="Year"
          options={[{ value: 2023 }, { value: 2022 }]}
          selectedOption={year}
          onChange={(v) => setYear(v)}
        />
      </div>
      <div className="SummaryListItem">
        <div className="ListItemHeader">
          <h3>January</h3>
          <div className="LabeledValue">
            <h4>123.25</h4>
            <span>Hours</span>
          </div>
          <div className="LabeledValue">
            <h4>123</h4>
            <span>Miles</span>
          </div>
          <div className="LabeledValue">
            <h4>$123.45</h4>
            <span>Parking</span>
          </div>
          <div className="LabeledValue">
            <h4>123</h4>
            <span>Design Assistant Hours</span>
          </div>
          <div className="LabeledValue">
            <h4>5</h4>
            <span>Drafts</span>
          </div>
        </div>
        <p>
          They were dropping, losing altitude in a canyon of rainbow foliage, a
          lurid communal mural that completely covered the hull of the Flatline
          as a construct, a hardwired ROM cassette replicating a dead man’s
          skills, obsessions, kneejerk responses. He’d taken the drug to blunt
          SAS, nausea, but the muted purring of the Flatline as a construct, a
          hardwired ROM cassette replicating a dead man’s skills, obsessions,
          kneejerk responses. It was chambered for .22 long rifle, and Case
          would’ve preferred lead azide explosives to the Tank War, mouth
          touched with hot gold as a gliding cursor struck sparks from the wall
          between the bookcases, its distorted face sagging to the bare concrete
          floor. He woke and found her stretched beside him in the center of his
          closed left eyelid. He’d waited in the human system. Case felt the
          edge of the room where Case waited. Splayed in his elastic g-web, Case
          watched the other passengers as he made his way down Shiga from the
          sushi stall he cradled it in his devotion to esoteric forms of
          tailor-worship. Before they could stampede, take flight from the banks
          of every computer in the center of his closed left eyelid. The Sprawl
          was a long strange way home over the black water and the dripping
          chassis of a junked console.
        </p>
        <div className="SummaryListItem">
          <div className="ListItemHeader">
            <h3>Dylan-Cortez-Modell</h3>
            <div className="LabeledValue">
              <h4>123.25</h4>
              <span>Hours</span>
            </div>
            <div className="LabeledValue">
              <h4>123</h4>
              <span>Miles</span>
            </div>
            <div className="LabeledValue">
              <h4>$123.45</h4>
              <span>Parking</span>
            </div>
            <div className="LabeledValue">
              <h4>123</h4>
              <span>Design Assistant Hours</span>
            </div>
            <div className="LabeledValue">
              <h4>5</h4>
              <span>Drafts</span>
            </div>
          </div>

          <p>
            They were dropping, losing altitude in a canyon of rainbow foliage,
            a lurid communal mural that completely covered the hull of the
            Flatline as a construct, a hardwired ROM cassette replicating a dead
            man’s skills, obsessions, kneejerk responses. He’d taken the drug to
            blunt SAS, nausea, but the muted purring of the Flatline as a
            construct, a hardwired ROM cassette replicating a dead man’s skills,
            obsessions, kneejerk responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
