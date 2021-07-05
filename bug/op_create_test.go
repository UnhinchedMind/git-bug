package bug

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/MichaelMure/git-bug/entity"
	"github.com/MichaelMure/git-bug/identity"
	"github.com/MichaelMure/git-bug/repository"
	"github.com/MichaelMure/git-bug/util/timestamp"
)

func TestCreate(t *testing.T) {
	snapshot := Snapshot{}

	repo := repository.NewMockRepoClock()

	rene, err := identity.NewIdentity(repo, "René Descartes", "rene@descartes.fr")
	require.NoError(t, err)

	unix := time.Now().Unix()

	create := NewCreateOp(rene, unix, "title", "message", nil)

	create.Apply(&snapshot)

	id := create.Id()
	require.NoError(t, id.Validate())

	comment := Comment{
		id:       entity.CombineIds(create.Id(), create.Id()),
		Author:   rene,
		Message:  "message",
		UnixTime: timestamp.Timestamp(create.UnixTime),
	}

	expected := Snapshot{
		id:    create.Id(),
		title: "title",
		comments: []Comment{
			comment,
		},
		author:       rene,
		participants: []identity.Interface{rene},
		actors:       []identity.Interface{rene},
		CreateTime:   create.Time(),
		timeline: []TimelineItem{
			&CreateTimelineItem{
				CommentTimelineItem: NewCommentTimelineItem(comment),
			},
		},
	}

	require.Equal(t, expected, snapshot)
}

func TestCreateSerialize(t *testing.T) {
	repo := repository.NewMockRepo()

	rene, err := identity.NewIdentity(repo, "René Descartes", "rene@descartes.fr")
	require.NoError(t, err)

	unix := time.Now().Unix()
	before := NewCreateOp(rene, unix, "title", "message", nil)

	data, err := json.Marshal(before)
	require.NoError(t, err)

	var after CreateOperation
	err = json.Unmarshal(data, &after)
	require.NoError(t, err)

	// enforce creating the ID
	before.Id()

	// Replace the identity stub with the real thing
	require.Equal(t, rene.Id(), after.Author().Id())
	after.Author_ = rene

	require.Equal(t, before, &after)
}
