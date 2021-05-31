package commands

import (
	"github.com/spf13/cobra"

	"github.com/MichaelMure/git-bug/entity"
)

func newLsIdCommand() *cobra.Command {
	env := newEnv()

	cmd := &cobra.Command{
		Use:     "ls-id [PREFIX]",
		Short:   "List bug identifiers.",
		PreRunE: loadBackend(env),
		RunE: closeBackend(env, func(cmd *cobra.Command, args []string) error {
			return runLsId(env, args)
		}),
	}

	return cmd
}

func runLsId(env *Env, args []string) error {
	var prefix = ""
	if len(args) != 0 {
		prefix = args[0]
	}

	for _, id := range env.backend.AllBugsIds() {
		if prefix == "" || id.HasPrefix(entity.Id(prefix)) {
			env.out.Println(id)
		}
	}

	return nil
}
